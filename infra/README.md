# Infrastructure (Terraform)

Provisions the AWS production deployment described in the Technical Design
Document §8:

- **Frontend** — S3 (private bucket) + CloudFront (Origin Access Control,
  SPA-friendly 404/403 → `index.html` rewrite).
- **Backend** — ECR repository, ECS Fargate service + task definition, an
  internet-facing Application Load Balancer, CloudWatch log group, and the
  IAM execution/task roles the service needs.

Both modules deploy into the AWS account's **default VPC** — no custom
networking (VPC/subnets/NAT) is created, keeping this self-contained and
free of prerequisites. ECS tasks run in the default VPC's public subnets
with `assign_public_ip = true` so they can reach ECR and CloudWatch without
a NAT gateway.

The backend has no secrets (the CSV-backed data source and cache-only config
mean every setting is non-sensitive), so task environment variables are set
directly in the task definition rather than via SSM Parameter Store.

## Prerequisites

- Terraform >= 1.5
- AWS CLI, authenticated with credentials that can create the resources
  above
- Docker (to build and push the backend image)

## Structure

```
infra/
├── main.tf          # provider config, module wiring
├── variables.tf      # root input variables (region, image tag, sizing, ...)
├── outputs.tf         # ECR URI, ALB URL, S3 bucket, CloudFront URL
└── modules/
    ├── backend/       # ECR + ECS Fargate + ALB
    └── frontend/       # S3 + CloudFront
```

## Deploy workflow

Run all commands from the repo root unless noted.

```bash
# 1. Initialise Terraform (first time only)
cd infra
terraform init

# 2. Provision the ECR repository and S3/CloudFront first, so the ECR URI
#    exists before an image is pushed. (ECS service creation will fail until
#    an image is pushed — see step 4 — but everything else applies cleanly.)
terraform apply

# 3. Build and push the backend Docker image.
#    Build context is the REPO ROOT (the Dockerfile COPYs /data from there).
cd ..
ECR_URI=$(terraform -chdir=infra output -raw ecr_repository_url)
aws ecr get-login-password --region ap-southeast-1 | \
  docker login --username AWS --password-stdin "${ECR_URI%/*}"

docker build -f app/backend/Dockerfile -t hdb-backend .
docker tag hdb-backend:latest "$ECR_URI:latest"
docker push "$ECR_URI:latest"

# 4. Re-apply so the ECS service picks up the now-available image
#    (needed on first deploy only; subsequent image pushes need a new
#    image_tag + apply, or a forced new deployment).
cd infra
terraform apply

# 5. Build the frontend, pointed at the deployed backend's ALB URL
cd ../app/frontend
VITE_API_BASE_URL=$(terraform -chdir=../../infra output -raw alb_url) npm run build

# 6. Upload the build output to S3
cd ../..
BUCKET=$(terraform -chdir=infra output -raw frontend_bucket_name)
aws s3 sync app/frontend/dist "s3://$BUCKET" --delete

# 7. Invalidate the CloudFront cache so the new build is served immediately
DIST_ID=$(terraform -chdir=infra output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"
```

After step 7, the app is live at the `cloudfront_url` output.

## Updating the backend

Push a new image tag and re-apply with `-var="image_tag=<tag>"`, or push to
the same `latest` tag and force a fresh deployment:

```bash
aws ecs update-service \
  --cluster "$(terraform -chdir=infra output -raw ecs_cluster_name)" \
  --service "$(terraform -chdir=infra output -raw ecs_service_name)" \
  --force-new-deployment
```

## Refreshing the CSV dataset

The backend loads `/data/*.csv` at container startup and bakes those files
into the Docker image (see [backend Dockerfile](../app/backend/Dockerfile)).
To ship new data: replace/add files under the repo-root `/data` folder,
rebuild and push the image, then force a new deployment as above.

## Variables

| Variable | Default | Description |
|---|---|---|
| `aws_region` | `ap-southeast-1` | AWS region |
| `project_name` | `hdb-resale-sg` | Prefix for resource names/tags |
| `environment` | `production` | Environment tag |
| `image_tag` | `latest` | Backend image tag to deploy |
| `backend_container_port` | `4000` | Port the Express app listens on |
| `backend_cpu` / `backend_memory` | `256` / `512` | Fargate task sizing |
| `backend_desired_count` | `1` | Number of running ECS tasks |
| `cors_origin` | `*` | Backend `CORS_ORIGIN` — set to the CloudFront URL in production |
| `cache_ttl_seconds` | `3600` | Backend query cache TTL |
| `log_level` | `info` | Backend pino log level |

Override any of these with `-var` or a `*.tfvars` file (already gitignored).

## Known limitations

Mirrors TDD §11: single-region, no autoscaling policy (desired count is
static), no custom domain/Route 53 (CloudFront's default `*.cloudfront.net`
domain is used), and the default VPC's public subnets are used directly
rather than provisioning a private-subnet + NAT topology.

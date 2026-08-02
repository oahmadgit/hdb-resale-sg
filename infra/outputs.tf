output "ecr_repository_url" {
  description = "Push backend Docker images here"
  value       = module.backend.ecr_repository_url
}

output "alb_url" {
  description = "Backend API base URL"
  value       = module.backend.alb_url
}

output "ecs_cluster_name" {
  value = module.backend.ecs_cluster_name
}

output "ecs_service_name" {
  value = module.backend.ecs_service_name
}

output "frontend_bucket_name" {
  description = "Sync the frontend build output here"
  value       = module.frontend.bucket_name
}

output "cloudfront_distribution_id" {
  description = "Use for cache invalidation after a deploy"
  value       = module.frontend.cloudfront_distribution_id
}

output "cloudfront_url" {
  description = "Public URL of the deployed frontend"
  value       = module.frontend.cloudfront_url
}

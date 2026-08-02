output "ecr_repository_url" {
  description = "ECR repository URI to push backend images to"
  value       = aws_ecr_repository.backend.repository_url
}

output "alb_dns_name" {
  description = "Public DNS name of the backend ALB"
  value       = aws_lb.backend.dns_name
}

output "alb_url" {
  description = "Base URL of the backend API"
  value       = "http://${aws_lb.backend.dns_name}"
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "ecs_service_name" {
  value = aws_ecs_service.backend.name
}

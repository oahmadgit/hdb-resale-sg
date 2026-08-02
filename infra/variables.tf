variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Short name used to prefix/tag all resources"
  type        = string
  default     = "hdb-resale-sg"
}

variable "environment" {
  description = "Deployment environment name (e.g. production, staging)"
  type        = string
  default     = "production"
}

variable "image_tag" {
  description = "Docker image tag to deploy for the backend ECS service"
  type        = string
  default     = "latest"
}

variable "backend_container_port" {
  description = "Port the backend Express app listens on inside the container"
  type        = number
  default     = 4000
}

variable "backend_cpu" {
  description = "Fargate task CPU units"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Fargate task memory (MiB)"
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
}

variable "cors_origin" {
  description = "Allowed CORS origin for the backend API (the CloudFront domain)"
  type        = string
  default     = "*"
}

variable "cache_ttl_seconds" {
  description = "In-memory query cache TTL for the backend"
  type        = number
  default     = 3600
}

variable "log_level" {
  description = "pino log level for the backend"
  type        = string
  default     = "info"
}

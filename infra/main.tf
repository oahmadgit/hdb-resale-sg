terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

module "backend" {
  source = "./modules/backend"

  project_name      = var.project_name
  environment       = var.environment
  aws_region        = var.aws_region
  image_tag         = var.image_tag
  container_port    = var.backend_container_port
  cpu               = var.backend_cpu
  memory            = var.backend_memory
  desired_count     = var.backend_desired_count
  cors_origin       = var.cors_origin
  cache_ttl_seconds = var.cache_ttl_seconds
  log_level         = var.log_level
}

module "frontend" {
  source = "./modules/frontend"

  project_name = var.project_name
  environment  = var.environment
}

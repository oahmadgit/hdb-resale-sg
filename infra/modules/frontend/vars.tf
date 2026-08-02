variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "backend_api_url" {
  description = "Base URL of the deployed backend API (unused directly by Terraform; documented for the build step)"
  type        = string
  default     = ""
}

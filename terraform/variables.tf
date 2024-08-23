variable "web_client_port" {
  type    = string
  default = "3100"
}

variable "api_port" {
  type    = string
  default = "3200"
}

variable "db_root_user" {
  type = string
}

variable "database_name" {
  description = "The name of the database that you want created."
  type        = string
  default     = null
}

variable "database_username" {
  description = "The name of the database username that you want created."
  type        = string
  default     = null
}

variable "password_version" {
  description = "The password rotates when this value gets updated."
  type        = number
  default     = 0
}

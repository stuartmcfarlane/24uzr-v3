terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.16.0"
    }
  }
}

provider "docker" {
  host = "unix:///Users/stuart//.docker/run/docker.sock"
}

variable "web_client_port" {
  default = "3100"
}

resource "docker_image" "nextjs" {
  name = "24uzr-nextjs-development"
  build {
    path       = "../"
    dockerfile = "Dockerfile"
  }
}

resource "docker_container" "app-development" {
  name  = "24uzr-terraform-development"
  image = docker_image.nextjs.latest
  #   image   = "24uzr-nextjs-development:latest"
  restart = "always"
  ports {
    internal = "3000"
    external = var.web_client_port
  }
}

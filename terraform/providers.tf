terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.16.0"
    }
    mysql = {
      source  = "petoju/mysql"
      version = "3.0.37"
    }
  }
}

provider "docker" {
  host = "unix:///Users/stuart//.docker/run/docker.sock"
}

provider "mysql" {
  alias = "local"
  # endpoint = "${docker_container.mysql.ip_address}:3306" # the "external" port
  endpoint = "127.0.0.1:3306"
  username = var.db_root_user
  password = random_password.mysql_root_password.result
}

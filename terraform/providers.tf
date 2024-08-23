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
  endpoint = "${docker_container.mysql.ip_address}:3306" # the "external" port
  username = "root"
  password = random_password.mysql_root_password.result
}


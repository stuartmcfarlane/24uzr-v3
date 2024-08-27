resource "docker_image" "nextjs" {
  name = "24uzr-nextjs"
  build {
    path       = "../web/"
    dockerfile = "Dockerfile"
  }
  force_remove = true
}

resource "docker_image" "api" {
  name = "24uzr-api"
  build {
    path       = "../api/"
    dockerfile = "Dockerfile"
  }
  force_remove = true
}

resource "docker_image" "nginx" {
  name = "nginx:latest"
}

resource "docker_image" "mysql" {
  name = "mysql:8"
}

resource "random_password" "mysql_root_password" {
  length = 16
}

# resource "docker_volume" "db_volume" {
#   name = "db_volume"
# }

resource "docker_network" "backplane" {
  name   = "24uzr-backplane"
  driver = "bridge"
}

resource "docker_container" "web" {
  name    = "24uzr-web"
  image   = docker_image.nextjs.latest
  restart = "always"

  networks_advanced {
    name    = docker_network.backplane.name
    aliases = ["backplane"]
  }
  ports {
    internal = "3000"
  }
}

resource "docker_container" "api" {
  image = docker_image.api.name
  name  = "24uzr-api"
  env   = ["NODE_PORT=3000"]

  #command = ["npm","install","--save"]
  user              = "node"
  entrypoint        = ["nohup", "node", "index.js", "&"]
  must_run          = true
  restart           = "always"
  publish_all_ports = true

  networks_advanced {
    name    = docker_network.backplane.name
    aliases = ["backplane"]
  }

  ports {
    internal = 3000
    protocol = "tcp"
  }
}

# data "local_file" "nginx_config" {
#   filename = "/etc/nginx/nginx.conf"
#   content  = <<EOF
# events {
#   worker_connections  1024;
# }

# http {
# 	upstream api {
# 	    server ${docker_container.api.ip_address}:3000;
# 	}
# 	upstream web {
# 	    server ${docker_container.web.ip_address}:3000;
# 	}

# 	server {
#         listen 8080;
#         listen [::]:8080 ipv6only=on;

# 	    location / {
# 	        proxy_pass http://web;
# 	    }
# 	    location /api/ {
# 	        proxy_pass http://api;
# 	    }
# 	}
# }
#   EOF
# }
resource "docker_container" "nginx" {
  image = docker_image.nginx.name
  name  = "nginx"

  must_run          = true
  publish_all_ports = false
  depends_on = [
    docker_container.api
  ]

  ports {
    internal = 8080
    external = 8080
    protocol = "tcp"
  }
  networks_advanced {
    name    = docker_network.backplane.name
    aliases = ["backplane"]
  }

  upload {
    # content = data.local_file.nginx_config
    file    = "/etc/nginx/nginx.conf"
    content = <<EOF
events {
  worker_connections  1024;
}

http {
	upstream api {
	    server ${docker_container.api.ip_address}:3000;
	}
	upstream web {
	    server ${docker_container.web.ip_address}:3000;
	}

	server {
        listen 8080;
        listen [::]:8080 ipv6only=on;

	    location /api/ {
	        proxy_pass http://api/;
	    }
	    location / {
	        proxy_pass http://web/;
	    }
	}
}
  EOF
  }
}

resource "docker_container" "mysql" {
  name  = "mysql"
  image = docker_image.mysql.latest
  env = [
    "MYSQL_ROOT_PASSWORD=${random_password.mysql_root_password.result}"
  ]
  networks_advanced {
    name    = docker_network.backplane.name
    aliases = ["backplane"]
  }
  ports {
    internal = 3306
    external = 3306
  }
  volumes {
    container_path = "/var/lib/mysql/"
    host_path      = abspath("../mysql/data/")
    # volume_name    = docker_volume.db_volume.name
  }
}

resource "random_password" "user_password" {
  length           = 24
  special          = true
  min_special      = 2
  override_special = "!#$%^&*()-_=+[]{}<>:?"
  keepers = {
    password_version = var.password_version
  }
}

resource "mysql_database" "user_db" {
  provider = mysql.local
  name     = var.database_name
}

resource "mysql_user" "user_id" {
  provider           = mysql.local
  user               = var.database_username
  plaintext_password = random_password.user_password.result
  host               = "%"
  tls_option         = "NONE"
}

resource "mysql_grant" "user_id" {
  provider   = mysql.local
  user       = var.database_username
  host       = "%"
  database   = var.database_name
  privileges = ["SELECT", "UPDATE"]
  depends_on = [
    mysql_user.user_id
  ]
}

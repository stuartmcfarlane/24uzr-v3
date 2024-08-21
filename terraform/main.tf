resource "docker_image" "nextjs" {
  name = "24uzr-nextjs"
  build {
    path       = "../web/"
    dockerfile = "Dockerfile"
  }
  force_remove = true
}

resource "docker_image" "node" {
  name = "24uzr-node"
  build {
    path       = "../app/"
    dockerfile = "Dockerfile"
  }
  force_remove = true
}

resource "docker_image" "nginx" {
  name = "nginx:latest"
}

# resource "docker_image" "db" {
#   name = "mysql:5.7"
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
    external = var.web_client_port
  }
}

resource "docker_container" "api" {
  image = docker_image.node.name
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
    external = var.api_port
    protocol = "tcp"
  }
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.name
  name  = "nginx"

  #command          = ["rm -rf etc/nginx/conf.d/default.conf"]
  #entrypoint       = ["/usr/sbin/nginx -g"]

  must_run          = true
  restart           = "always"
  publish_all_ports = false
  depends_on        = [docker_container.api]

  ports {
    internal = 8080
    external = 8888
    protocol = "tcp"
  }

  upload {
    content = file("../app/nginx.conf")
    file    = "/etc/nginx/nginx.conf"
  }
}


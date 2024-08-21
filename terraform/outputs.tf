output "nginx_ip" {
  value = docker_container.nginx.ip_address
}

output "api_ip" {
  value = docker_container.api.ip_address
}

output "web_ip" {
  value = docker_container.web.ip_address
}

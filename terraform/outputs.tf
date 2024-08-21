output "nginx_ip" {
  value = docker_container.nginx.ip_address
}

output "api_ip" {
  value = docker_container.api.ip_address
}

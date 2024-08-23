output "nginx_ip" {
  value = docker_container.nginx.ip_address
}

output "api_ip" {
  value = docker_container.api.ip_address
}

output "web_ip" {
  value = docker_container.web.ip_address
}

output "mysql_ip" {
  value = docker_container.mysql.ip_address
}

output "db_user" {
  value = mysql_user.user_id.user
}

output "root_db_password" {
  sensitive = true
  value     = random_password.mysql_root_password.result
}

output "db_password" {
  sensitive = true
  value     = random_password.user_password.result
}

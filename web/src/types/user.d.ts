export interface IApiUserCredentials {
  email: string
  password: string
}
export interface IApiUser {
  id: number
  isAdmin: boolean
  email: string
  name: string
}
export interface IApiMap {
  id: number
  name: string
}
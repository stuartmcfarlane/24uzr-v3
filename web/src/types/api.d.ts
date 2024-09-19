import { IApiMap } from './api';
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
export interface IApiMapInput {
  name: string
}
export interface IApiMapOutput {
  id: number
  name: string
}

export type IApiMap = IApiMapInput | IApiMapOutput

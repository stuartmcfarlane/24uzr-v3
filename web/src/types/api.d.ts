import { IApiMap } from './api';
export interface IApiUserCredentials {
  email: string
  password: string
}
export interface IApiUserOutput {
  id: number
  isAdmin: boolean
  email: string
  name: string
}
export interface IApiUserInput {
  isAdmin: boolean
  email: string
  password?: string
  name: string
}
export type IApiUser = IApiUserInput | IApiUserOutput

export interface IApiMapInput {
  name: string
}
export interface IApiMapOutput {
  id: number
  name: string
}

export type IApiMap = IApiMapInput | IApiMapOutput

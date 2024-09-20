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
export interface IApiMapOutput extends IApiMapInput {
  id: number
}

export type IApiMap = IApiMapInput | IApiMapOutput

export interface IApiBuoyInput {
  name: string
  mapId: number
  lat: number
  lng: number
}
export interface IApiBuoyOutput extends IApiBuoyInput{
  id: number
}

export type IApiBuoy = IApiBuoyInput | IApiBuoyOutput

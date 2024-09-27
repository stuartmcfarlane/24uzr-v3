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
  isLocked: boolean
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

export interface IApiLegInput {
  mapId: number
  startBuoyId: number
  endBuoyId: number
}
export interface IApiLegOutput extends IApiLegInput{
  id: number
}

export type IApiLeg = IApiLegInput | IApiLegOutput

export type ApiRouteStatus = ("PENDING" | "FAILED" | "DONE")

export interface IApiRouteInput {
  mapId: number
  ownerId: number
  name: string
  startBuoyId: number
  endBuoyId: number
}
export interface IApiRouteOutput extends IApiRouteInput{
  id: number
  status: ApiRouteStatus
  createdAt: string
  updatedAt: string
  legs: IApiRouteLegOutput[]
}

export type IApiRoute = IApiRouteInput | IApiRouteOutput

export interface IApiRouteLegInput {
  mapId: number
  routeId: number
  startBuoyId: number
  endBuoyId: number
}
export interface IApiRouteLegOutput extends IApiRouteLegInput{
  leg: IApiLegOutput
}

export type IApiRouteLeg = IApiRouteLegInput | IApiRouteLegOutput


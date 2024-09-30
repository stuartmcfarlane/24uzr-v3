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
  isLocked: boolean
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
export type IApiRouteType = ("USER" | "SHORTEST")

export interface IApiRouteInputWithoutName {
  mapId: number
  planId: number
  name?: string
  type: IApiRouteType
  startBuoyId: number
  endBuoyId: number
}
export interface IApiRouteInput {
  ownerId?: number
  mapId: number
  planId: number
  name: string
  type: IApiRouteType
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

export interface IApiPlanInput {
  ownerId?: number
  mapId: number
  name: string
  startBuoyId: number
  endBuoyId: number
}
export interface IApiPlanOutput extends IApiPlanInput{
  id: number
  createdAt: string
  updatedAt: string
  routes: IApiRouteOutput[]
}

export type IApiPlan = IApiPlanInput | IApiPlanOutput


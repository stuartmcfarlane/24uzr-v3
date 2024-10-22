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

export type Region = {
  lat1: number
  lng1: number
  lat2: number
  lng2: number
}
export type PartialRegion = {
  lat1: number
  lng1: number
  lat2?: number
  lng2?: number
}


export interface IApiMapInput {
  name: string
  isLocked: boolean
  lat1: number
  lng1: number
  lat2: number
  lng2: number
}
export type IApiMapUpdateInput = {
  name?: string
  isLocked?: boolean
} | {
  name?: string
  isLocked?: boolean
  lat1: number
  lng1: number
  lat2: number
  lng2: number
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
export type ApiPlanStatus = ApiRouteStatus
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
  startBuoy: IApiBuoyOutput
  endBuoy: IApiBuoyOutput
}

export type IApiRoute = IApiRouteInput | IApiRouteOutput

export interface IApiRouteLegInput {
  mapId: number
  routeId: number
  startBuoyId: number
  endBuoyId: number
}
export type IApiRouteLegLegOutput = IApiLegOutput & {
  startBuoy: IApiBuoyOutput
  endBuoy: IApiBuoyOutput
}

export interface IApiRouteLegOutput extends IApiRouteLegInput{
  index: number
  leg: IApiRouteLegLegOutput
}

export type IApiRouteLeg = IApiRouteLegInput | IApiRouteLegOutput

export interface IApiPlanInput {
  ownerId?: number
  mapId: number
  shipId: number
  name: string
  startBuoyId: number
  endBuoyId: number
  raceSecondsRemaining: number
  startTime: string
}
export interface IApiPlanOutput extends IApiPlanInput{
  id: number
  createdAt: string
  updatedAt: string
  startBuoy: IApiBuoyOutput
  endBuoy: IApiBuoyOutput
  status: ApiPlanStatus
  routes: IApiRouteOutput[]
}

export type IApiPlan = IApiPlanInput | IApiPlanOutput

export interface IApiWind {
  lat: number
  lng: number
  u: number
  v: number
}
export interface IApiSingleWind extends IApiWind{
  timestamp: string
}
export interface IApiBulkWind {
  timestamp: string
  data: IApiWind[]
}

export type IApiWindInput = (
  IApiSingleWind |
  IApiSingleWind[] |
  IApiBulkWind |
  IApiBulkWind[]
)
export type IApiWindOutput = (
  IApiSingleWind |
  IApiSingleWind[] |
  IApiBulkWind |
  IApiBulkWind[]
)

export type IApiGeometryInput = any
export type IApiGeometryOutput = any

export type IApiShipInput = {
  ownerId: number
  name: string
  polar: string
}
export type IApiShipUpdateInput = {
  ownerId?: number
  name?: string
  polar?: string
}
export type IApiShipOutput = IApiShipInput & {
  id: number
  createdAt: string
  updatedAt: string
}

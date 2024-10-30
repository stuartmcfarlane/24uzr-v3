import { IApiBuoyOutput, IApiPlanOutput, IApiRouteLegOutput, IApiRouteOutput } from "@/types/api";
import {
    bearingLatLan,
    CmpFunction,
    cmpNumber,
    distanceLatLng,
    fmtReal,
    idIs,
    IndexedWind,
    meters2nM,
    ShipPolar,
    shipSpeed,
    sort,
    Timestamp,
    Vector,
    vectorMagnitude,
    timestamp2epoch,
    metersPerSecond2knots,
    knots2metersPerSecond,
    epoch2timestamp,
    windAtTime,
    windAtLocation,
    wind2degrees,
    last,
} from 'tslib';

export type FleshedRouteBuoy = IApiBuoyOutput & {
    timestamp: Timestamp
}
export type FleshedRouteLeg = IApiRouteLegOutput & {
    startTime: Timestamp
    endTime: Timestamp
    boatSpeed: number
    bearing: number
    distance: number
    windSpeed: number
    windAngle: number
    startBuoy: FleshedRouteBuoy
    endBuoy: FleshedRouteBuoy
}
export type FleshedRoute = IApiRouteOutput & {
    legs: FleshedRouteLeg[]
    startBuoy: FleshedRouteBuoy
    endBuoy: FleshedRouteBuoy
    startTime: Timestamp
    endTime: Timestamp
    distance: number
}
export const fmtNM = (n: number) => `${fmtReal(n, 1)} nM`
export const route2LengthNm = (route: IApiRouteOutput): number => {
    const meters = route.legs.reduce(
        (lengthM, legOnRoute) => {
            return lengthM + distanceLatLng(legOnRoute.leg.startBuoy, legOnRoute.leg.endBuoy)
        },
        0
    )
    return meters2nM(meters)
    
}
export const cmpRouteLength: CmpFunction<IApiRouteOutput> = (a, b) => {
    return cmpNumber(route2LengthNm(a), route2LengthNm(b))
}
export const cmpRouteLegOrder: CmpFunction<IApiRouteLegOutput | FleshedRouteLeg> = (
    a: IApiRouteLegOutput|FleshedRouteLeg,
    b: IApiRouteLegOutput|FleshedRouteLeg
) => {
    return cmpNumber(a.index, b.index)
}

const fleshenBuoy = (timestamp: Timestamp, buoy: IApiBuoyOutput): FleshedRouteBuoy => {
    return {
        ...buoy,
        timestamp,
    }
}
const fleshenLeg = (shipPolar: ShipPolar, vWind: Vector, startTime: Timestamp, leg: IApiRouteLegOutput): FleshedRouteLeg => {
    const startBuoy = leg.leg.startBuoy
    const endBuoy = leg.leg.endBuoy
    const distanceM = distanceLatLng(startBuoy, endBuoy)
    const bearing = bearingLatLan(startBuoy, endBuoy)
    const distance = meters2nM(distanceM)
    const windSpeed = metersPerSecond2knots(vectorMagnitude(vWind))
    const windAngle = wind2degrees(vWind)
    const boatSpeed = shipSpeed(shipPolar)(bearing, vWind)
    const endTime = epoch2timestamp(timestamp2epoch(startTime) + distanceM / knots2metersPerSecond(boatSpeed))

    const fleshedLeg = {
        ...leg,
        startTime,
        endTime,
        bearing,
        distance,
        windSpeed,
        windAngle,
        boatSpeed,
        startBuoy: fleshenBuoy(startTime, startBuoy),
        endBuoy: fleshenBuoy(endTime, endBuoy),
   }
    return fleshedLeg
}
export const fleshenRoute = (shipPolar: ShipPolar, winds: IndexedWind[], plan: IApiPlanOutput, route: IApiRouteOutput): FleshedRoute | undefined => {
    const planRoute = plan.routes.find(idIs(route.id))
    if (!planRoute) return undefined
    if (!windAtTime(winds, plan.startTime)) return undefined
    const fleshedRoute = sort(cmpRouteLegOrder)(planRoute.legs).reduce<FleshedRoute>(
        (fleshedRoute: FleshedRoute, leg) => {
            const startTime = fleshedRoute.endTime
            const wind = windAtTime(winds, startTime)
            const fleshedLeg = fleshenLeg(
                shipPolar,
                windAtLocation(wind, leg.leg.startBuoy),
                startTime,
                leg
            )
            return {
                ...fleshedRoute,
                endTime: fleshedLeg.endTime,
                endBuoy: fleshedLeg.endBuoy,
                distance: fleshedRoute.distance + fleshedLeg.distance,
                legs: [
                    ...fleshedRoute.legs,
                    fleshedLeg
                ]
            } as FleshedRoute
        },
        {
            ...planRoute,
            startTime: plan.startTime,
            endTime: plan.startTime,
            startBuoy: fleshenBuoy(plan.startTime, plan.startBuoy),
            distance: 0,
            legs: [] as FleshedRouteLeg[],
        } as FleshedRoute
    )
    return fleshedRoute
}

export const isFleshedRouteLeg = (leg: FleshedRouteLeg | IApiRouteLegOutput) => 'startTime' in leg

export const findRouteLegAtTime = (timestamp: Timestamp,) => (route?: FleshedRoute) => {
    const timestampEpoch = timestamp2epoch(timestamp)
    const fleshedLegs = (route?.legs || []).filter(isFleshedRouteLeg)
    const routeLegsBeforeTime = fleshedLegs.filter(
        leg => (
            timestamp2epoch(leg.startTime) <= timestampEpoch
            && timestampEpoch <= timestamp2epoch(leg.endTime)
        )
    )
    return last(routeLegsBeforeTime)
}

import { Buoy, Leg, LegsOnRoute, Plan, Route, Ship } from "@prisma/client"
import { CreateRouteInput } from "../modules/route/route.schema"
import {
    parseShipPolar,
    ShipPolar,
    shipSpeed,
    LatLng,
    distanceLatLng,
    bearingLatLan,
    Wind,
    windAtLocation,
    indexBy,
    indexByHash,
} from 'tslib';

export const getAllRoutes = async (
    plan: Plan,
    startBuoy: Buoy,
    endBuoy: Buoy,
    ship: Ship,
    legs: Leg[],
    buoys: Buoy[],
    wind: Wind[],
): Promise<CreateRouteInput[]> => {
    const buoysById = indexBy('id')(buoys)

    const graph = makeGraph(ship, legs, buoysById, wind)
    const count = 10
    const allRoutes = (
        await routeApiPost(`route/all?start=${startBuoy.id}&end=${endBuoy.id}&time=${plan.raceSecondsRemaining}&count=${count}`, graph)
    ) as AllRoutesOutput
    if (!allRoutes) return []

    const routes = allRoutes.Paths.map(path2legs(legs)).map((legs, idx) => ({
        name: `${plan.name} route ${idx}`,
        ownerId: plan.ownerId,
        mapId: plan.mapId,
        planId: plan.id,
        type: 'GENERATED',
        status: 'DONE',
        startBuoyId: plan.startBuoyId,
        endBuoyId: plan.endBuoyId,
        legs,
    } as CreateRouteInput))
    return routes    
}

export const getShortestRoute = async (
    route: Route,
    startBuoy: Buoy,
    endBuoy: Buoy,
    ship: Ship,
    legs: Leg[],
    buoys: Buoy[],
    wind: Wind[],
): Promise<LegsOnRoute[]> => {

    try {

        const buoysById = indexBy('id')(buoys)
        const graph = makeGraph(ship, legs, buoysById, wind)
        
        const shortestRoute = (await routeApiPost(`route/shortest?start=${startBuoy.id}&end=${endBuoy.id}`, graph)) as ShortestRouteOutput
        if (!shortestRoute) return []


        const routeLegs = path2legs(legs)(shortestRoute.Path).map(
            leg => ({
                ...leg,
                routeId: route.id
            })
        )

        return routeLegs
    }
    catch (e) {
        return []
    }
}

type RouteApiPath = {
    Metres: number
    Seconds: number
    Nodes: string[]
}
type RouteApiRoute = {
    Start: string
    End: string
    Path: RouteApiPath
}

type RouteApiRoutes = {
    Start: string
    End: string
    Paths: RouteApiPath[]
}

type RouteApiEdge = {
    Start: string
    End: string
    Metres: number
    MetresPerSecondSE: number
    MetresPerSecondES: number
}
type RouteApiGraph = {
    Edges: RouteApiEdge[]
}

type AllRoutesInput = RouteApiGraph
type AllRoutesOutput = RouteApiRoutes
type ShortestRouteInput = RouteApiGraph
type ShortestRouteOutput = RouteApiRoute
type RouteApiInput = (
    AllRoutesInput
    | ShortestRouteInput
)
type RouteApiOutput = (
    undefined
    | AllRoutesOutput
    | ShortestRouteOutput
)
const buoy2latLng = (buoy: Buoy): LatLng => {
    return {
        lat: buoy.lat.toNumber(),
        lng: buoy.lng.toNumber(),
    }
}
const makeGraph = (ship: Ship, legs: Leg[], buoysById: { [id: number]: Buoy }, wind: Wind[]) => {
    const shipPolar = parseShipPolar(ship.polar)
    return {
        Edges: legs.map((leg) => {

            const startBuoy = buoysById[leg.startBuoyId]
            const endBuoy = buoysById[leg.endBuoyId]
            const metres = getMetres(buoy2latLng(startBuoy), buoy2latLng(endBuoy))
            const metresPerSecondSE = getMetresPerSecondVMG(
                shipPolar, wind, buoy2latLng(startBuoy), buoy2latLng(endBuoy)
            )
            const metresPerSecondES = getMetresPerSecondVMG(
                shipPolar, wind, buoy2latLng(endBuoy), buoy2latLng(startBuoy)
            )
            const made = {
                Start: `${leg.startBuoyId}`,
                End: `${leg.endBuoyId}`,
                Metres: metres,
                MetresPerSecondSE: metresPerSecondSE,
                MetresPerSecondES: metresPerSecondES,
            }
            return made
        })
    }
}

const routeApiPost = async (uri: string, data: RouteApiInput): Promise<RouteApiOutput> => {
    try {
        const response = await fetch(`http://${process.env.ROUTE_API_URL}:${process.env.ROUTE_API_PORT}/${uri}`, {
            method: 'post',
            body: JSON.stringify(data)
        })
        if (!response.ok) return undefined
        const json = await response.json()
        const result = json as RouteApiOutput
        return result
    }
    catch (e) {
        return undefined
    }
}

const startEndHash = (start: number, end: number) => `${start}:${end}`
const legHash = (leg: Leg) => startEndHash(leg.startBuoyId, leg.endBuoyId)

const path2legs = (legs: Leg[]) => {

    const legsByHash = indexByHash(legHash)(legs)

    return (path: RouteApiPath) => {
        const [startNode, endNode, ...tailNodes] = path.Nodes

        const nodePairs = tailNodes.reduce(
            (nodePairs, node) => {
                const start = nodePairs[nodePairs.length - 1].end
                const end = parseInt(node)
                
                return [
                    ...nodePairs,
                    { start, end }
                ]
            },
            [{ start: parseInt(startNode), end: parseInt(endNode) }]
        )
        const routeLegs = nodePairs.map(
            ({ start, end }, index) => {
                return {
                    legId: legsByHash[startEndHash(start, end)].id,
                    index,
                }
            }
        )
        return routeLegs
    }
}

const knots2metersPerSecond = (knots: number) => knots * 0.514444
const getMetres = (start: LatLng, end: LatLng) => {
    return distanceLatLng(start, end)
}


const getMetresPerSecondVMG = (
    shipPolar: ShipPolar,
    wind: Wind[],
    start: LatLng,
    end: LatLng
) => {
    const windAtStart = windAtLocation(wind, start)
    const shipDegrees = bearingLatLan(start, end)
    const knotsVMG = shipSpeed(shipPolar)(shipDegrees, windAtStart)
    return knots2metersPerSecond(knotsVMG)
}

const degrees2radians = (d: number) => d * Math.PI / 180
const radians2degrees = (r: number) => r * 180 / Math.PI


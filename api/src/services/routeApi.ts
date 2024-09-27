import { Buoy, Leg, LegsOnRoute, Route, Ship } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { indexBy, indexByHash } from "../utils/indexBy"

export type Wind = {}

export const getAllRoutes = async(
    startBuoy: Buoy,
    endBuoy: Buoy,
    ship: Ship,
    legs: Leg[],
    buoys: Buoy[],
    wind: Wind,
) => {
    const buoysById = buoys.reduce( (buoysById,buoy) => {
        buoysById[buoy.id] = buoy
        return buoysById
    }, {} as { [id: number]: Buoy })

    const graph = makeGraph(ship, legs, buoysById, wind)
    
    const allRoutes = (await routeApiPost(`route/all?start=${startBuoy.id}&end=${endBuoy.id}`, graph)) as AllRoutesOutput
    if (!allRoutes) return undefined

    console.log('got', allRoutes)
    const routes = {
        start: allRoutes.start,
        end: allRoutes.end,
        paths: allRoutes.paths.map(path => {
            return {
                length: path.metres,
                seconds: path.seconds,
                buoys: path.nodes,
            }
        })
    }
    return routes    
}

export const getShortestRoute = async (
    route: Route,
    startBuoy: Buoy,
    endBuoy: Buoy,
    ship: Ship,
    legs: Leg[],
    buoys: Buoy[],
    wind: Wind,
): Promise<LegsOnRoute[]> => {

    console.log(`>getShortestRoute`)
    const buoysById = indexBy('id')(buoys)
    const graph = makeGraph(ship, legs, buoysById, wind)
    
    const shortestRoute = (await routeApiPost(`route/shortest?start=${startBuoy.id}&end=${endBuoy.id}`, graph)) as ShortestRouteOutput
    if (!shortestRoute) return []

    console.log('got', shortestRoute)

    const [startNode, ...tailNodes] = shortestRoute.path.nodes

    const nodePairs = tailNodes.reduce(
        (nodePairs, node) => {
            const start = nodePairs[ nodePairs.length - 1].end
            const end =  parseInt(node)
            
            return [
                ...nodePairs,
                { start, end }
            ]
        },
        [ { start: parseInt(startNode), end: parseInt(tailNodes[0])}]
    )
    const startEndHash = (start: number, end: number) => `${start}:${end}`
    const legHash = (leg: Leg) => startEndHash(leg.startBuoyId, leg.endBuoyId)
    const legsByHash = indexByHash(legHash)(legs)

    const routeLegs = nodePairs.map(
        ({ start, end }, index) => ({
            routeId: route.id,
            legId: legsByHash[startEndHash(start, end)].id,
            index,
        })
    )

    return routeLegs
}

type RouteApiPath = {
    metres: number
    seconds: number
    nodes: string[]
}
type RouteApiRoute = {
    start: string
    end: string
    path: RouteApiPath
}

type RouteApiRoutes = {
    start: string
    end: string
    paths: RouteApiPath[]
}

type RouteApiEdge = {
    start: string
    end: string
    metres: number
    metresPerSecondSE: number
    metresPerSecondES: number
}
type RouteApiGraph = {
    edges: RouteApiEdge[]
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
const makeGraph = (ship: Ship, legs: Leg[], buoysById: { [id: number]: Buoy }, wind: Wind) => {
    return {
        edges: legs.map((leg) => {

            const startBuoy = buoysById[leg.startBuoyId]
            const endBuoy = buoysById[leg.endBuoyId]
            const metres = getMetres(startBuoy, endBuoy)
            const metresPerSecondSE = getMetresPerSecondVMG(
                ship, wind, startBuoy, endBuoy
            )
            const metresPerSecondES = getMetresPerSecondVMG(
                ship, wind, endBuoy, startBuoy
            )
            const made = {
                start: `${leg.startBuoyId}`,
                end: `${leg.endBuoyId}`,
                metres,
                metresPerSecondSE,
                metresPerSecondES,
            }
            return made
        })
    }
}

const routeApiPost = async (uri: string, data: RouteApiInput): Promise<RouteApiOutput> => {
    console.log(`>routeApiPost ${uri}`, JSON.stringify(data))
    console.log(` routeApiPost fetch?`, fetch)
    const response = await fetch(`http://${process.env.ROUTE_API_URL}:${process.env.ROUTE_API_PORT}/${uri}`, {
        body: JSON.stringify(data)
    })
    console.log(` routeApiPost reply`, response)
    if (!response.ok) return undefined
    const result = JSON.parse(await response.json()) as RouteApiOutput
    console.log(` routeApiPost`, result)
    return result
}

type Vector = [number, number]
const vector2radians = ([x, y]: Vector) => Math.atan2(y,x)
const vector2degrees = (v: Vector): number => radians2degrees(vector2radians(v))
const metersPerSecond2knots = (metersPerSecond: number) => metersPerSecond * 1.94384
const knots2metersPerSecond = (knots: number) => knots * 0.514444
const meters2nM = (meters: number) => meters * 0.000539957
const vector2magnitude = ([x, y]: Vector) => Math.sqrt(x*x + y*y)
type LatLng = {
    lat: Decimal
    lng: Decimal
}
const getMetres = (start: LatLng, end: LatLng) => {
    console.log(`>getMeters`)
    return distanceLatLng(start, end)
}
const windAtLocation = (wind: Wind, start: LatLng): Vector => [1, 1]

const shipKnotsVMG = (ship: Ship, shipDegrees: number, windVector: Vector): number => 5

const getMetresPerSecondVMG = (
    ship: Ship,
    wind: Wind,
    start: Buoy,
    end: Buoy
) => {
    const windAtStart = windAtLocation(wind, start)
    const shipDegrees = bearingLatLan(start, end)
    const knotsVMG = shipKnotsVMG(ship, shipDegrees, windAtStart)
    console.log('speed', wind, knots2metersPerSecond(knotsVMG))
    return knots2metersPerSecond(knotsVMG)
}

const degrees2radians = (d: number) => d * Math.PI / 180
const radians2degrees = (r: number) => r * 180 / Math.PI

function distanceLatLng(start: LatLng, end: LatLng) {
    console.log(`>distanceLatLng`, start, end)
    const { lat: lat1, lng: lng1 } = start
    const { lat: lat2, lng: lng2 } = end
    var R = 6371e3 // metres
    var φ1 = degrees2radians(lat1.toNumber())
    var φ2 = degrees2radians(lat2.toNumber())
    var Δφ = degrees2radians(lat2.toNumber()-lat1.toNumber())
    var Δλ = degrees2radians(lng2.toNumber()-lng1.toNumber())

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    var d = R * c
    console.log(`<distanceLatLng`, d)
    return d
}

function bearingLatLan({ lat: lat1, lng: lng1 }: LatLng, {lat: lat2, lng: lng2}: LatLng) {
    var φ1 = degrees2radians(lat1.toNumber())
    var φ2 = degrees2radians(lat2.toNumber())
    var Δλ = degrees2radians(lng2.toNumber()-lng1.toNumber())
    var y = Math.sin(Δλ) * Math.cos(φ2)
    var x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ)
    var bearing = radians2degrees(Math.atan2(y, x))
    return bearing
}



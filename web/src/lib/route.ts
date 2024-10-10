import { IApiLegOutput, IApiRouteLegOutput, IApiRouteOutput } from "@/types/api";
import { fmtReal } from "./graph";

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

const meters2nM = (meters: number) => meters * 0.000539957
export function distanceLatLng(start: LatLng, end: LatLng) {
    const { lat: lat1, lng: lng1 } = start
    const { lat: lat2, lng: lng2 } = end
    var R = 6371e3 // metres
    var φ1 = degrees2radians(lat1)
    var φ2 = degrees2radians(lat2)
    var Δφ = degrees2radians(lat2-lat1)
    var Δλ = degrees2radians(lng2-lng1)

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    var d = R * c
    return d // meters
}
const degrees2radians = (d: number) => d * Math.PI / 180
const radians2degrees = (r: number) => r * 180 / Math.PI


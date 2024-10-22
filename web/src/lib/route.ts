import { IApiRouteOutput } from "@/types/api";
import { distanceLatLng, fmtReal, meters2nM } from "tslib";

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

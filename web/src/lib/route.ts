import { IApiRouteLegLegOutput, IApiRouteLegOutput, IApiRouteOutput } from "@/types/api";
import { CmpFunction, cmpNumber, distanceLatLng, fmtReal, meters2nM } from "tslib";

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
export const cmpRouteLegOrder: CmpFunction<IApiRouteLegOutput> = (a, b) => {
    return cmpNumber(a.index, b.index)
}
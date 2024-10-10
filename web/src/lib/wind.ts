import { IApiBuoyOutput, IApiWindOutput } from "@/types/api";
import { nM2meters } from "./conversions";
import { distanceLatLng } from "./route";

export const wind2resolution = (wind: IApiWindOutput[]) => {
    const [head, ...tail] = wind
    const resolution = tail.reduce(
        (resolution, wind: IApiWindOutput) => {
            const distance = distanceLatLng(head, wind)
            if (resolution === 0) return distance
            if (distance === 0) return resolution
            return Math.min(distance, resolution)
        },
        0
    )
    console.log(`wind2resolution`, resolution)
    return resolution
}
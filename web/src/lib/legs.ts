import { IApiLegOutput } from "@/types/api"
import { and, idIsNot } from "./fp"

const isReturnLeg = (needle: IApiLegOutput) => (haystack: IApiLegOutput) => (
    needle.startBuoyId === haystack.endBuoyId
    && needle.endBuoyId === haystack.startBuoyId
)

// take an array if directed legs and return an array of single directed leg OR a pair of
// directed legs 
// [
//    a -> b,
//    b -> c,
//    c -> b,
//    c -> d
// ]
// =>
// [
//    [a -> b],
//    [
//       b -> c,
//       c -> b,
//    ],
//    [c -> d]
// ]
export const actualLegs = (
        legs: IApiLegOutput[] = []
): IApiLegOutput[][] => {
        if (!legs.length) return []
        const [leg, ...tail] = legs
        const returnLeg = tail.find(isReturnLeg(leg))
        if (!returnLeg) {
            return [
                [leg],
                ...actualLegs(legs.filter(idIsNot(leg.id)))
            ]
        }
        return [
            leg.id < returnLeg.id ? [leg, returnLeg] : [returnLeg, leg],
            ...actualLegs(legs.filter(and(idIsNot(leg.id), idIsNot(returnLeg.id))))
        ]
    }

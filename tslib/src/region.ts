import { LatLng } from "./geo"

export type Region = {
    lat1: number
    lng1: number
    lat2: number
    lng2: number
}

export const regionBottomLeft = ({ lat1, lng1 }: Region): LatLng => {
    return {lat: lat1, lng: lng1 }
}

export const regionTopRight = ({  lat2, lng2 }: Region): LatLng => {
    return {lat: lat2, lng: lng2 }
}

export const makeRegion = (p1: LatLng, p2: LatLng): Region => ({
    lng1: p1.lng,
    lat1: p1.lat,
    lng2: p2.lng,
    lat2: p2.lat,
})

export const regionUnion = (r1: Region, r2: Region): Region => makeRegion(
    {
        lng: Math.min(r1.lng1, r2.lng1),
        lat: Math.min(r1.lat1, r2.lat1),
    },
    {
        lng: Math.max(r1.lng2, r2.lng2),
        lat: Math.max(r1.lat2, r2.lat2),
    },
)

export const extendRegion = (region: Region | undefined, position: LatLng): Region => {
    if (!region) {
        return makeRegion(position, position)
    }
    const {lng, lat} = position
    return makeRegion(
        {
            lng: Math.min(lng, region.lng1),
            lat: Math.min(lat, region.lat1),
        },
        {
            lng: Math.max(lng, region.lng2),
            lat: Math.max(lat, region.lat2),
        },
    )
}

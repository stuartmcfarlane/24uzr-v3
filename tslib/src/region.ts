import { LatLng } from "./geo"

export type Region = {
    lat1: number
    lng1: number
    lat2: number
    lng2: number
}

export const regionBottomLeft = ({ lat1, lng1 }: Region): LatLng => {
    console.log(`regionBottomLeft`, lat1, lng1)
    return {lat: lat1, lng: lng1 }
}

export const regionTopRight = ({  lat2, lng2 }: Region): LatLng => {
    return {lat: lat2, lng: lng2 }
}
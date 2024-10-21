import { degrees2radians, radians2degrees } from "./conversions"

export type LatLng = {
    lat: number
    lng: number
}

export const  distanceLatLng = (start: LatLng, end: LatLng)  => {
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
    return d
}

export const bearingLatLan = ({ lat: lat1, lng: lng1 }: LatLng, {lat: lat2, lng: lng2}: LatLng) => {
    var φ1 = degrees2radians(lat1)
    var φ2 = degrees2radians(lat2)
    var Δλ = degrees2radians(lng2-lng1)
    var y = Math.sin(Δλ) * Math.cos(φ2)
    var x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ)
    var bearing = radians2degrees(Math.atan2(y, x))
    return bearing
}

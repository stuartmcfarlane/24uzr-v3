import { Radians } from "./angles"
import { roundTo } from './math';

export type LatLng = {
    lat: number
    lng: number
}
const geo2radians = (geoAngle: number) => geoAngle * Math.PI / 180
const radians2geo = (radians: Radians) => radians * 180 / Math.PI

export const  distanceLatLng = (start: LatLng, end: LatLng)  => {
    const { lat: lat1, lng: lng1 } = start
    const { lat: lat2, lng: lng2 } = end
    var R = 6371e3 // metres
    var φ1 = geo2radians(lat1)
    var φ2 = geo2radians(lat2)
    var Δφ = geo2radians(lat2-lat1)
    var Δλ = geo2radians(lng2-lng1)

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    var d = R * c
    return roundTo(4)(d)
}

export const bearingLatLan = ({ lat: lat1, lng: lng1 }: LatLng, {lat: lat2, lng: lng2}: LatLng) => {
    var φ1 = geo2radians(lat1)
    var φ2 = geo2radians(lat2)
    var Δλ = geo2radians(lng2-lng1)
    var y = Math.sin(Δλ) * Math.cos(φ2)
    var x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ)
    var bearing = radians2geo(Math.atan2(y, x))
    return roundTo(4)(bearing < 0 ? bearing + 360 : bearing)
}


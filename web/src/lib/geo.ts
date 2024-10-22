import { convert } from "geo-coordinates-parser"
import { fmtUndefined, LatLng } from "tslib"

export const fmtLatLng = (latLng?: LatLng): string => !latLng ? fmtUndefined() : decimal2geo(latLng)

export const geo2decimal = (geo: string): LatLng | undefined => {
    try {
        const converted = convert(geo)
        return {
            lat: parseFloat(converted.decimalLatitude),
            lng: parseFloat(converted.decimalLongitude),
        }
    }
    catch (e) {
        console.error(e)
        return undefined
    }
    
}

export const decimal2geo = (latLng: LatLng) => {
    try {
        const converted = convert(`${latLng.lat}, ${latLng.lng}`)
        return  converted.toCoordinateFormat('DMS')
    }
    catch (e) {
        return `${latLng.lng}, ${latLng.lat}`
    }
    
}

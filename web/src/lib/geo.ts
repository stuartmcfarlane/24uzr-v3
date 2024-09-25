import { convert } from "geo-coordinates-parser"

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
        undefined
    }
    
}

export const decimal2geo = (latLng: LatLng) => {
    try {
        console.error('convert lat,lng => geo not implemented')
        const converted = convert(`${latLng.lat}, ${latLng.lng}`)
        return {
            lat: 0,
            lng: 0,
        }
    }
    catch (e) {
        console.error(e)
        undefined
    }
    
}

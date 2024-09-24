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

export const parseNameLatLng = (nameLatLng: string): {
    name: string,
    lat: number,
    lng: number,
} | undefined => {
    const parts = nameLatLng.split(',')
    if (parts.length === 3) {
        const name = parts[0].trim()
        const latLng = geo2decimal(`${parts[1]}, ${parts[2]}`)
        if (latLng) {
            return {
                name,
                ...latLng
            }
        }
    }
    return undefined
}
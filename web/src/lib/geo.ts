import { convert } from "geo-coordinates-parser"

export const geo2decimal = (geo: string): LatLng | undefined => {
    console.log(`>geo2decimal ${geo}`)
    try {
        const converted = convert(geo)
        console.log(` geo2decimal ${geo}`, converted)
        return {
            lat: parseFloat(converted.decimalLatitude),
            lng: parseFloat(converted.decimalLongitude),
        }
    }
    catch (e) {
        console.log(e)
        undefined
    }
    
}

export const decimal2geo = (latLng: LatLng) => {
    try {
        const converted = convert(`${latLng.lat}, ${latLng.lng}`)
        console.log(`decimal2geo`, converted)
        return {
            lat: 0,
            lng: 0,
        }
    }
    catch (e) {
        console.log(e)
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
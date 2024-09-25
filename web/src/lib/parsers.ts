import { IApiBuoyInput, IApiBuoyOutput, IApiLegInput } from "@/types/api"
import { geo2decimal } from "./geo"

type NameLatLng = {
    name: string
    lat: number
    lng: number
}
export const parseNameLatLng = (nameLatLng: string): NameLatLng | undefined => {
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


export const parseBuoys = (bulkData: string): {
    parsed: NameLatLng[],
    unparsed: string,
} => {
    const lines = bulkData.split('\n')

    const { parsed, unparsed } = lines.reduce(
        (previousValue, line) => {
            const { parsed, unparsed } = previousValue
            const p = parseNameLatLng(line)
            if (!p) return {
                parsed,
                unparsed: [...unparsed, line]
            }
            return {
                parsed: [...parsed, p],
                unparsed,
            }
        },
        {
            parsed: [] as NameLatLng[],
            unparsed: [] as string[]
        }
    )
    return {
        parsed: parsed,
        unparsed: unparsed.join('\n')
    }
}
export const parseLegs = (buoys: IApiBuoyOutput[], bulkData: string): {
    parsed: IApiLegInput[],
    unparsed: string,
} => {
    const lines = bulkData.split('\n')

    const buoysByName = buoys.reduce(
        (buoysByName, buoy) => {
            buoysByName.set(buoy.name, buoy)
            return buoysByName
        },
        new Map<string, IApiBuoyOutput>()
    )
    const { parsed, unparsed } = lines.reduce(
        (previousValue, line) => {
            const { parsed, unparsed } = previousValue
            const p = /^\s*([^,\s]*)\s*,\s*([^,\s]*)\s*$/.exec(line)
            if (!p) return {
                parsed,
                unparsed: [...unparsed, line]
            }
            const [, start, end] = p
            const startBuoy = buoysByName.get(start)
            const endBuoy = buoysByName.get(end)
            if (!startBuoy || !endBuoy || startBuoy.mapId !== endBuoy.mapId) return {
                parsed,
                unparsed: [...unparsed, line]
            }
            const startBuoyId = startBuoy.id
            const endBuoyId = endBuoy.id
            const mapId = startBuoy.mapId
            return {
                parsed: [...parsed, {
                    mapId,
                    startBuoyId,
                    endBuoyId,
                }],
                unparsed,
            }
        },
        {
            parsed: [] as IApiLegInput[],
            unparsed: [] as string[]
        }
    )
    return {
        parsed: parsed,
        unparsed: unparsed.join('\n')
    }
}

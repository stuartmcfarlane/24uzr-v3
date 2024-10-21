import { distanceLatLng, LatLng } from './geo';
import { makeVector, Vector } from './vector';

export type Wind = {
  lat: number
  lng: number
  u: number
  v: number
}
export type SingleWind = Wind & {
  timestamp: string
}

export type BulkWind = {
  timestamp: string
  data: Wind[]
}


export const wind2resolution = (wind: SingleWind[]) => {
    const [head, ...tail] = wind
    const resolution = tail.reduce(
        (resolution, wind) => {
            const distance = distanceLatLng(head, wind)
            if (resolution === 0) return distance
            if (distance === 0) return resolution
            return Math.min(distance, resolution)
        },
        0
    )
    console.log(`wind2resolution`, resolution)
    return resolution
}

export const indexWindByTimestamp = (wind: SingleWind[]) => {
  return wind.reduce(
    (windByTimestamp, wind) => {
      if (!windByTimestamp[wind.timestamp]) {
        windByTimestamp[wind.timestamp] = []
      }
      windByTimestamp[wind.timestamp].push(wind)
      return windByTimestamp
    },
    {} as { [k: string]: SingleWind[] }
  )
}

export const windAtLocation = (wind: Wind[], { lat, lng }: LatLng): Vector => makeVector(1, 1)

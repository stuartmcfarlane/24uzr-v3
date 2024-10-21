import { distanceLatLng, LatLng } from './geo';
import { makeVector, Vector } from './vector';

export type Wind = {
  lat: number
  lng: number
  u: number
  v: number
}
export type SingleWind = Wind & {
  timestamp: string | Date
}

export type BulkWind = {
  timestamp: string | Date
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
    return resolution
}
export const timestamp2string = (timestamp: string | Date) => typeof timestamp === "string" ? timestamp : timestamp.toISOString()
export const timestampIs = (timestamp: string | Date) => (wind: BulkWind) => wind.timestamp === timestamp2string(timestamp)

export const indexWindByTimestamp = (wind: SingleWind[]) => {
  return wind.reduce(
    (windByTimestamp, wind) => {
      const timestamp = typeof wind.timestamp === "string" ? wind.timestamp : wind.timestamp.toISOString()
      if (!windByTimestamp[timestamp]) {
        windByTimestamp[timestamp] = []
      }
      windByTimestamp[timestamp].push(wind)
      return windByTimestamp
    },
    {} as { [k: string]: SingleWind[] }
  )
}

export const makeTimestampSlicedWind = (wind: SingleWind[]): BulkWind[] => {
  const windByTimestamp = indexWindByTimestamp(wind)
    const timestamps = Object.keys(windByTimestamp) as string[]
    const bulkWind = timestamps.map(
        (timestamp: string) => ({
            timestamp,
            data: windByTimestamp[timestamp]
        })
    )
    return bulkWind
}
export const windAtLocation = (wind: Wind[], { lat, lng }: LatLng): Vector => makeVector(1, 1)

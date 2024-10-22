import { indexByHash, project, toFixed, unique, cmpNumber, sort } from './fp'
import { distanceLatLng, LatLng } from './geo'
import { makeVector, Vector } from './vector'

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

export type IndexedWind = {
  timestamp: string
  lats: number[]
  lngs: number[]
  indexedByLatLng: { [hash: string]: Wind}
}
const wind2vector = ({ u, v }: Wind): Vector => makeVector(u, v)

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
export const timestampIs = (timestamp: string | Date) => (wind: IndexedWind | BulkWind) => wind.timestamp === timestamp2string(timestamp)

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
const latLngHash = ({ lat, lng }: LatLng): string => `${toFixed(3)(lng)}:${toFixed(3)(lat)}`
export const makeIndexedWind = (wind: SingleWind[]): IndexedWind[] => {
  const timeSliced = makeTimestampSlicedWind(wind)
  const indexed = timeSliced.map(
    ({ timestamp, data }) => {
      return {
        timestamp: timestamp2string(timestamp),
        lats: sort(cmpNumber)(unique(data.map(project('lat')))),
        lngs: sort(cmpNumber)(unique(data.map(project('lng')))),
        indexedByLatLng: indexByHash<Wind>(latLngHash)(data)
      }
    }
  )
  return indexed
}
function binarySearch(arr: number[], target: number): number {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    if (arr[mid] === target) {
      return arr[mid]
    } else if (arr[mid] < target) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return arr[low]
}
let sdm = 0
export const windAtLocation = (wind: IndexedWind, { lat, lng }: LatLng): Vector => {
  const latLng = {
    lat: binarySearch(wind.lats, lat),
    lng: binarySearch(wind.lngs, lng),
  }

  if (!wind.indexedByLatLng[latLngHash(latLng)]) {
    return makeVector(0, 0)
  }
  return wind2vector(wind.indexedByLatLng[latLngHash(latLng)])
  
}

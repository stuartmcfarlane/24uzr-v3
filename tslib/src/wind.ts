import { indexByHash, project, toFixed, unique, cmpNumber, sort, cmpString, head } from './fp';
import { distanceLatLng, LatLng } from './geo'
import { makeVector, Vector } from './vector'
import { seconds2hours, timestamp2epoch, timestamp2string } from './time';

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

export type WindIndicatorMode = 'text' | 'graphic'

const wind2vector = ({ u, v }: Wind): Vector => makeVector(u, v)
const latLngHash = ({ lat, lng }: LatLng): string => `${toFixed(3)(lng)}:${toFixed(3)(lat)}`

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

export const singleWind2bulkWind = (wind: SingleWind[]): BulkWind[] => {
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
export const bulkWind2indexedWind = (bulkWind: BulkWind[]): IndexedWind[] => {
  const indexed = bulkWind.map(
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

export const singleWind2indexedWind = (wind: SingleWind[]): IndexedWind[] => {
  return bulkWind2indexedWind(singleWind2bulkWind(wind))
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

export const windAtLocation = (wind: IndexedWind, { lat, lng }: LatLng): Vector => {
  if (!wind.timestamp) {
    debugger
  }

  const latLng = {
    lat: binarySearch(wind.lats, lat),
    lng: binarySearch(wind.lngs, lng),
  }

  if (!wind.indexedByLatLng[latLngHash(latLng)]) {
    return makeVector(0, 0)
  }
  return wind2vector(wind.indexedByLatLng[latLngHash(latLng)])
  
}
export const windAtTime = (winds: IndexedWind[], timestamp: Date | string) => {
  if (!timestamp) return undefined
  const t0 = timestamp2epoch(
    head(
      sort(cmpString)(
      winds
        .map(project('timestamp'))
          .map(timestamp2string)
      )
    )
  )
  const t1 = timestamp2epoch(timestamp)
  const deltaHours = Math.trunc(seconds2hours(t1 - t0))
  if (deltaHours < 0 || winds.length < deltaHours) {
    return undefined
  }
  return winds[deltaHours]
}
export const windAtTimeAndLocation = (winds: IndexedWind[], timestamp: Date | string, location: LatLng) => {
  const wind = windAtTime(winds, timestamp)
  if (!wind) return makeVector(0, 0)
  return windAtLocation(wind, location)
}


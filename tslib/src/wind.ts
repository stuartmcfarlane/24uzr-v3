import { indexByHash, project, toFixed, unique, cmpNumber, sort, cmpString, head, findNearest } from './fp'
import { distanceLatLng, LatLng } from './geo'
import { makeVector, Vector, vectorAngle, vectorMagnitude, vectorScale } from './vector'
import { seconds2hours, Timestamp, timestamp2epoch, timestamp2string, Timestamped } from './time'
import { radians2degrees } from './angles'
import { metersPerSecond2knots } from './conversions'
import { roundTo } from './math'
import { fmtVector } from './fmt'

export type UV = {
  u: number
  v: number
}

export type Wind = UV & LatLng

export type SingleWind = Wind & {
  timestamp: Timestamp
}

export type BulkWind = {
  timestamp: Timestamp
  data: Wind[]
}

export type IndexedWind = {
  timestamp: Timestamp
  lats: number[]
  lngs: number[]
  indexedByLatLng: { [hash: string]: Wind }
  data: Wind[],
}

export const wind2vector = ({ u, v }: UV): Vector => makeVector(roundTo(8)(u), roundTo(8)(v))
export const vector2wind = ({ x, y }: Vector): UV => ({ u: roundTo(8)(x), v: roundTo(8)(y) })

const latLngHash = ({ lat, lng }: LatLng): string => `${toFixed(3)(lng)}:${toFixed(3)(lat)}`

export const wind2degrees = ({x, y}: Vector) => {
  return roundTo(4)(radians2degrees(vectorAngle({x: -x, y: -y})))
}
export const wind2knots = (vWind: Vector) => {
  return roundTo(4)(metersPerSecond2knots(vectorMagnitude(vWind)))
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
        timestamp: timestamp,
        lats: sort(cmpNumber)(unique(data.map(project('lat')))),
        lngs: sort(cmpNumber)(unique(data.map(project('lng')))),
        indexedByLatLng: indexByHash<Wind>(latLngHash)(data),
        data,
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
  if (!wind || !wind.timestamp) {
    return makeVector(0, 0)
  }

  const latLng = {
    lat: findNearest(wind.lats, lat),
    lng: findNearest(wind.lngs, lng),
  }

  const uv = wind.indexedByLatLng[latLngHash(latLng)]
  if (!uv) {
    return makeVector(0, 0)
  }
  return wind2vector(uv)
  
}
export const windIndexAtTime = (winds: Timestamped[], timestamp: Timestamp) => {
  if (!timestamp) return 0
  const timestamps = sort(cmpString)(
      winds
        .map(project('timestamp'))
        .map(timestamp2string)
  )
  const t0 = timestamp2epoch(head(timestamps))
  const t1 = timestamp2epoch(timestamp)
  const deltaHours = Math.trunc(seconds2hours(t1 - t0))
  if (deltaHours < 0 || winds.length < deltaHours) {
    return 0
  }
  if (winds.length < deltaHours) {
    return winds.length
  }
  return deltaHours
}
export const windAtTime = <T>(winds: (Timestamped & T)[], timestamp: Timestamp): T => {
  return winds[windIndexAtTime(winds, timestamp)]
}
export const windAtTimeAndLocation = (winds: IndexedWind[], timestamp: Timestamp, location: LatLng) => {
  const wind = windAtTime(winds, timestamp)
  if (!wind) return makeVector(0, 0)
  return windAtLocation(wind, location)
}


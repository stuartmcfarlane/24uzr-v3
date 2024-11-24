import { describe, expect, it } from '@jest/globals';
import { bulkWind2indexedWind,
  project,
  SingleWind,
  singleWind2bulkWind,
  singleWind2indexedWind,
  timestampIs,
  vectorRotate,
  wind2degrees,
  wind2knots,
  wind2vector,
  windAtLocation,
  windAtTime,
  windIndexAtTime,
  makeVector,
  vector2wind,
} from '../dist';

const π = Math.PI

const northWind = { u: 0, v: -1 }
const westWind = { u: 1, v: 0 }
const southWind = { u: 0, v: 1 }
const eastWind = { u: -1, v: 0 }

const northWind16 = { u: 0, v: -8.23111 }
const westWind16 = { u: 8.23111, v: 0 }
const southWind16 = { u: 0, v: 8.23111 }
const eastWind16 = { u: -8.23111, v: 0 }
const southwestWind16 = { u: 5.8202737, v: 5.8202737 }

const northWind16vector = makeVector(0, -8.23111)
const westWind16vector = vectorRotate(π/2)(northWind16vector)
const southwestWind16vector = vectorRotate(3*π/4)(northWind16vector)
const southWind16vector = vectorRotate(π)(northWind16vector)
const eastWind16vector = vectorRotate(3*π/2)(northWind16vector)

const singleWinds: SingleWind[] = [
  {
    timestamp: '2024-11-02T10:00:00.000Z',
    lat: 52,
    lng: 4,
    u: -3.2829,
    v: -0.1418
  },
  {
    timestamp: '2024-11-02T10:00:00.000Z',
    lat: 53,
    lng: 4,
    u: -3.2829,
    v: -0.1418
  },
  {
    timestamp: '2024-11-02T10:00:00.000Z',
    lat: 54,
    lng: 4,
    u: -3.3566,
    v: -0.1511
  },
  {
    timestamp: '2024-11-02T10:00:00.000Z',
    lat: 52,
    lng: 5,
    u: -3.1706,
    v: -0.1513
  },
  {
    timestamp: '2024-11-02T10:00:00.000Z',
    lat: 53,
    lng: 5,
    u: -3.3901,
    v: -0.1252
  },
  {
    timestamp: '2024-11-02T10:00:00.000Z',
    lat: 54,
    lng: 5,
    u: -3.8141,
    v: -0.1227
  },
  {
    timestamp: '2024-11-02T11:00:00.000Z',
    lat: 52,
    lng: 4,
    u: -3.1611,
    v: -0.5488
  },
  {
    timestamp: '2024-11-02T11:00:00.000Z',
    lat: 53,
    lng: 4,
    u: -3.1611,
    v: -0.5488
  },
  {
    timestamp: '2024-11-02T11:00:00.000Z',
    lat: 54,
    lng: 4,
    u: -3.3041,
    v: -0.5068
  },
  {
    timestamp: '2024-11-02T11:00:00.000Z',
    lat: 52,
    lng: 5,
    u: -3.0527,
    v: -0.6155
  },
  {
    timestamp: '2024-11-02T11:00:00.000Z',
    lat: 53,
    lng: 5,
    u: -3.3163,
    v: -0.5627
  },
  {
    timestamp: '2024-11-02T11:00:00.000Z',
    lat: 54,
    lng: 5,
    u: -3.7572,
    v: -0.3984
  },
  {
    timestamp: '2024-11-02T12:00:00.000Z',
    lat: 52,
    lng: 4,
    u: -2.7471,
    v: -0.6971
  },
  {
    timestamp: '2024-11-02T12:00:00.000Z',
    lat: 53,
    lng: 4,
    u: -2.7471,
    v: -0.6971
  },
  {
    timestamp: '2024-11-02T12:00:00.000Z',
    lat: 54,
    lng: 4,
    u: -2.8797,
    v: -0.7957
  },
  {
    timestamp: '2024-11-02T12:00:00.000Z',
    lat: 52,
    lng: 5,
    u: -2.6856,
    v: -0.7185
  },
  {
    timestamp: '2024-11-02T12:00:00.000Z',
    lat: 53,
    lng: 5,
    u: -2.9065,
    v: -0.7974
  },
  {
    timestamp: '2024-11-02T12:00:00.000Z',
    lat: 54,
    lng: 5,
    u: -3.3387,
    v: -0.8123
  }
]

const unSignZeros = (o: any) => JSON.parse(JSON.stringify(o))

describe('wind2vector', () => {
  it('gives [0, -1] for north wind', ()=> {
    expect(unSignZeros(wind2vector(northWind))).toStrictEqual(makeVector(0, -1))
  })
  it('gives [-1, 0] for east wind', ()=> {
    expect(unSignZeros(wind2vector(eastWind))).toStrictEqual(makeVector(-1, 0))
  })
  it('gives [0, 1] for south wind', ()=> {
    expect(unSignZeros(wind2vector(southWind))).toStrictEqual(makeVector(0, 1))
  })
  it('gives [1, 0] for west wind', ()=> {
    expect(unSignZeros(wind2vector(westWind))).toStrictEqual(makeVector(1, 0))
  })
  it('gives north wind 16 for north wind 16', ()=> {
    expect(unSignZeros(wind2vector(northWind16))).toStrictEqual(unSignZeros(northWind16vector))
  })
  it('gives south wind 16 for south wind 16', ()=> {
    expect(unSignZeros(wind2vector(southWind16))).toStrictEqual(unSignZeros(southWind16vector))
  })
  it('gives west wind 16 for west wind 16', ()=> {
    expect(unSignZeros(wind2vector(westWind16))).toStrictEqual(unSignZeros(westWind16vector))
  })
  it('gives east wind 16 for east wind 16', ()=> {
    expect(unSignZeros(wind2vector(eastWind16))).toStrictEqual(unSignZeros(eastWind16vector))
  })
  it('gives southwest wind 16 for southwest wind 16', ()=> {
    expect(unSignZeros(wind2vector(southwestWind16))).toStrictEqual(unSignZeros(southwestWind16vector))
  })
  it('is symmetrical with vector2wind', ()=> {
    expect(vector2wind(wind2vector(southwestWind16))).toStrictEqual(unSignZeros(southwestWind16))
    expect(wind2vector(vector2wind(southwestWind16vector))).toStrictEqual(unSignZeros(southwestWind16vector))
  })
})

describe('wind2degrees', () => {
  it('gives 0 for north wind', ()=> {
    expect(wind2degrees(northWind16vector)).toBe(0)
  })
  it('gives 90 for east wind', ()=> {
    expect(wind2degrees(eastWind16vector)).toBe(90)
  })
  it('gives 180 for south wind', ()=> {
    expect(wind2degrees(southWind16vector)).toBe(180)
  })
  it('gives 270 for west wind', ()=> {
    expect(wind2degrees(westWind16vector)).toBe(270)
  })
  it('gives 225 for southwest wind', ()=> {
    expect(wind2degrees(southwestWind16vector)).toBe(225)
  })
})
describe('wind2knots', () => {
  it('gives 16 for north wind', ()=> {
    expect(wind2knots(northWind16vector)).toBe(16)
  })
  it('gives 16 for east wind', ()=> {
    expect(wind2knots(eastWind16vector)).toBe(16)
  })
  it('gives 16 for south wind', ()=> {
    expect(wind2knots(southWind16vector)).toBe(16)
  })
  it('gives 16 for west wind', ()=> {
    expect(wind2knots(westWind16vector)).toBe(16)
  })
  it('gives 16 for southwest wind', ()=> {
    expect(wind2knots(southwestWind16vector)).toBe(16)
  })
})

describe('singleWind2bulkWind', () => {
  const bulkWind = singleWind2bulkWind(singleWinds)
  it('should have all the timestamps as keys', () => {
    expect(bulkWind.length).toBe(3)
    expect(bulkWind.map(project('timestamp'))).toContain('2024-11-02T10:00:00.000Z')
    expect(bulkWind.map(project('timestamp'))).toContain('2024-11-02T11:00:00.000Z')
    expect(bulkWind.map(project('timestamp'))).toContain('2024-11-02T12:00:00.000Z')
  })
  it('should have all the data', () => {
    expect(bulkWind.find(timestampIs('2024-11-02T10:00:00.000Z'))?.data.length).toBe(6)
    expect(bulkWind.find(timestampIs('2024-11-02T11:00:00.000Z'))?.data.length).toBe(6)
    expect(bulkWind.find(timestampIs('2024-11-02T12:00:00.000Z'))?.data.length).toBe(6)
  })
})

describe('bulkWind2indexedWind', () => {
  const indexedWind = bulkWind2indexedWind(singleWind2bulkWind(singleWinds))
  it('should have lats', () => {
    expect(indexedWind[0]).toHaveProperty('lats')
  })
  it('should have lngs', () => {
    expect(indexedWind[0]).toHaveProperty('lngs')
  })
  it('should have indexedByLatLng', () => {
    expect(indexedWind[0]).toHaveProperty('indexedByLatLng')
  })
})

describe('windIndexAtTime', () => {
  const indexedWind = singleWind2indexedWind(singleWinds)
  it('should work for exact timestamp', () => {
    expect(windIndexAtTime(indexedWind, '2024-11-02T10:00:00.000Z')).toBe(0)
    expect(windIndexAtTime(indexedWind, '2024-11-02T11:00:00.000Z')).toBe(1)
    expect(windIndexAtTime(indexedWind, '2024-11-02T12:00:00.000Z')).toBe(2)
  })
  it('should work for inexact timestamp', () => {
    expect(windIndexAtTime(indexedWind, '2024-11-02T09:00:00.000Z')).toBe(0)
    expect(windIndexAtTime(indexedWind, '2024-11-02T10:10:00.000Z')).toBe(0)
    expect(windIndexAtTime(indexedWind, '2024-11-02T11:10:00.000Z')).toBe(1)
    expect(windIndexAtTime(indexedWind, '2024-11-02T11:50:00.000Z')).toBe(1)
    expect(windIndexAtTime(indexedWind, '2024-11-02T12:10:00.000Z')).toBe(2)
  })
})

describe('windAtLocation', () => {
  const indexedWind = singleWind2indexedWind(singleWinds)
  const wind = windAtTime(indexedWind, '2024-11-02T10:00:00.000Z')
  it('should work for exact location', () => {
    expect(windAtLocation(wind,{ lat: 52, lng: 4, })).toStrictEqual(makeVector(-3.2829, -0.1418))
    expect(windAtLocation(wind,{ lat: 53, lng: 4, })).toStrictEqual(makeVector(-3.2829, -0.1418))
    expect(windAtLocation(wind,{ lat: 54, lng: 4, })).toStrictEqual(makeVector(-3.3566, -0.1511))

    expect(windAtLocation(wind, { lat: 52, lng: 5, })).toStrictEqual(makeVector(-3.1706, -0.1513))
    expect(windAtLocation(wind,{ lat: 53, lng: 5, })).toStrictEqual(makeVector(-3.3901, -0.1252))
    expect(windAtLocation(wind, { lat: 54, lng: 5, })).toStrictEqual(makeVector(-3.8141, -0.1227))
  })
  it('should work for inexact location', () => {
    expect(windAtLocation(wind,{ lat: 52 - .49, lng: 4, })).toStrictEqual(makeVector(-3.2829, -0.1418))
    expect(windAtLocation(wind,{ lat: 52, lng: 4 - .49, })).toStrictEqual(makeVector(-3.2829, -0.1418))
    expect(windAtLocation(wind,{ lat: 52 - .49, lng: 4 - .49, })).toStrictEqual(makeVector(-3.2829, -0.1418))
    expect(windAtLocation(wind,{ lat: 52 + .49, lng: 4, })).toStrictEqual(makeVector(-3.2829, -0.1418))
    expect(windAtLocation(wind,{ lat: 52, lng: 4 + .49, })).toStrictEqual(makeVector(-3.2829, -0.1418))
    expect(windAtLocation(wind,{ lat: 52 + .49, lng: 4 + .49, })).toStrictEqual(makeVector(-3.2829, -0.1418))

    expect(windAtLocation(wind,{ lat: 54 - .49, lng: 4 - .49, })).toStrictEqual(makeVector(-3.3566, -0.1511))
    expect(windAtLocation(wind,{ lat: 54 - .49, lng: 4, })).toStrictEqual(makeVector(-3.3566, -0.1511))
    expect(windAtLocation(wind,{ lat: 54, lng: 4 - .49, })).toStrictEqual(makeVector(-3.3566, -0.1511))
    expect(windAtLocation(wind,{ lat: 54 + .49, lng: 4 + .49, })).toStrictEqual(makeVector(-3.3566, -0.1511))
    expect(windAtLocation(wind,{ lat: 54 + .49, lng: 4, })).toStrictEqual(makeVector(-3.3566, -0.1511))
    expect(windAtLocation(wind,{ lat: 54, lng: 4 + .49, })).toStrictEqual(makeVector(-3.3566, -0.1511))
  })
})

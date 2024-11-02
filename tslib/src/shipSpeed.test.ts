import { describe, expect, it } from '@jest/globals'
import { makeVector, shipSpeed } from '../dist'

const shipPolar = {
    '52': [ 4.67, 5.43, 5.82, 6.04, 6.14, 6.18, 6.21, 6.14 ],
    '60': [ 4.91, 5.61, 5.96, 6.17, 6.31, 6.37, 6.45, 6.43 ],
    '75': [ 5.05,  5.7, 6.06, 6.32, 6.54, 6.69, 6.86, 6.94 ],
    '90': [ 4.96, 5.67, 6.13, 6.44, 6.63, 6.87, 7.24, 7.49 ],
    '110': [ 4.85, 5.72,  6.2, 6.6, 6.97, 7.32, 7.94, 8.56 ],
    '120': [ 4.7,   5.6, 6.11, 6.51,   6.9, 7.32, 8.6, 10.03 ],
    '135': [ 4.22,  5.14, 5.83, 6.24,  6.62, 7.01, 8.13, 11.09 ],
    '150': [ 3.55, 4.53, 5.33, 5.91, 6.28, 6.63, 7.4, 9.22 ],
    twa: [ 52,  60,  75,  90, 110, 120, 135, 150 ],
    tws: [ 6,  8, 10, 12, 14, 16, 20, 24 ],
    beatAngles: [ 43.4, 41.5, 39.7, 38.4, 38.1, 38.2, 39.5, 42.6 ],
    beatVMG: [ 3.07, 3.67, 4.08, 4.33,  4.4, 4.42, 4.37, 4.16 ],
    runAngles: [ 146.8, 151.4, 154.6, 168.2, 178.1, 178.6, 178.6, 138.8 ],
    runVMG: [ 3.08, 3.92, 4.65, 5.31, 5.82, 6.17, 6.83, 7.99 ]
}

const northWind16 = makeVector(0, -9)

describe('shipSpeed', () => {
    it('calculates beat at 16knt', () => {
        expect(shipSpeed(shipPolar)(0, northWind16)).toBe(4.42)
    })
    it('calculates run at 16knt', () => {
        expect(shipSpeed(shipPolar)(180, northWind16)).toBe(6.17)
    })
    it('calculates 52 at 16knt', () => {
        expect(shipSpeed(shipPolar)(52, northWind16)).toBe(6.18)
    })
    it('calculates 60 at 16knt', () => {
        expect(shipSpeed(shipPolar)(60, northWind16)).toBe(6.37)
    })
    it('calculates 75 at 16knt', () => {
        expect(shipSpeed(shipPolar)(75, northWind16)).toBe(6.69)
    })
    it('calculates 90 at 16knt', () => {
        expect(shipSpeed(shipPolar)(90, northWind16)).toBe(6.87)
    })
    it('calculates 110 at 16knt', () => {
        expect(shipSpeed(shipPolar)(110, northWind16)).toBe(7.32)
    })
    it('calculates 120 at 16knt', () => {
        expect(shipSpeed(shipPolar)(120, northWind16)).toBe(7.32)
    })
    it('calculates 135 at 16knt', () => {
        expect(shipSpeed(shipPolar)(135, northWind16)).toBe(7.01)
    })
    it('calculates 150 at 16knt', () => {
        expect(shipSpeed(shipPolar)(150, northWind16)).toBe(6.63)
    })
})


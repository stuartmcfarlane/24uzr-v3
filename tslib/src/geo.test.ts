import { describe, expect, it } from '@jest/globals'
import { bearingLatLan, distanceLatLng, roundTo } from '../dist'

const buoyKR_A = { lat: 52.82572, lng: 5.22563 }
const buoySPORT_A = { lat: 52.96667, lng: 5.16667 }
const buoyLC11 = { lat: 52.81032, lng: 5.3033 }

describe('distanceLatLng', () => {
    it('gives correct distance for KR-A -> SPORT-A', () => {
        expect(roundTo(0)(distanceLatLng(buoyKR_A, buoySPORT_A))).toBe(16164)
    })
    it('gives correct distance for KR-A -> LC11', () => {
        expect(roundTo(0)(distanceLatLng(buoyKR_A, buoyLC11))).toBe(5493)
    })
})
 
describe('bearingLatLan', () => {
    it('gives sdm for KR-A -> SPORT-A', () => {
        expect(roundTo(0)(bearingLatLan(buoyKR_A, buoySPORT_A))).toBe(346)
    })
    it('gives sdm for SPORT-A -> KR-A', () => {
        expect(roundTo(0)(bearingLatLan(buoySPORT_A, buoyKR_A))).toBe(166)
    })
    it('gives sdm for KR-A -> LC11', () => {
        expect(roundTo(0)(bearingLatLan(buoyKR_A, buoyLC11))).toBe(108)
    })
})
 

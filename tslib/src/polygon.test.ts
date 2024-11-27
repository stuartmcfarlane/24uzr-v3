import { describe, expect, it } from '@jest/globals'
import { isPointInPolygon, makePoint } from '../dist'
import { Polygon } from './polygon'

const polygon: Polygon = [
    { x: 10, y: 10 },
    { x: 50, y: 10 },
    { x: 50, y: 20 },
    { x: 50, y: 30 },
    { x: 50, y: 40 },
    { x: 10, y: 40 },
    { x: 10, y: 30 },
    { x: 10, y: 20 },
    { x: 10, y: 10 }
]
const inside = makePoint(20, 20)
const outside = makePoint(0, 0)
const on1 = makePoint(10, 10)
const on2 = makePoint(20, 10)

describe('isPointInPolygon', () => {
    // it('is true for point inside', () => {
    //   expect(isPointInPolygon(polygon)(inside)).toBe(true)
    // })
    // it('is false for point outside', () => {
    //   expect(isPointInPolygon(polygon)(outside)).toBe(false)
    // })
    // it('is true for point on polygon', () => {
    //   expect(isPointInPolygon(polygon)(on1)).toBe(true)
    //   expect(isPointInPolygon(polygon)(on2)).toBe(true)
    // })
    it('works for specific test case #1', () => {
        const polygon: Polygon =  [
            { x: 10, y: 10 },
            { x: 60, y: 10 },
            { x: 60, y: 20 },
            { x: 60, y: 30 },
            { x: 60, y: 40 },
            { x: 60, y: 50 },
            { x: 60, y: 60 },
            { x: 10, y: 60 },
            { x: 60, y: 50 },
            { x: 60, y: 40 },
            { x: 60, y: 30 },
            { x: 60, y: 20 },
            { x: 10, y: 10 }
        ]
        expect(isPointInPolygon(polygon)(makePoint(10, 60))).toBe(true)
        expect(isPointInPolygon(polygon)(makePoint(20, 60))).toBe(true)
        expect(isPointInPolygon(polygon)(makePoint(30, 60))).toBe(true)
        expect(isPointInPolygon(polygon)(makePoint(40, 60))).toBe(true)
        expect(isPointInPolygon(polygon)(makePoint(50, 60))).toBe(true)
        expect(isPointInPolygon(polygon)(makePoint(60, 60))).toBe(true)
    })
})



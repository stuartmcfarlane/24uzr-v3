import { describe, expect, it } from '@jest/globals'
import { makePoint, makeScalarField, makeVector, makeVectorField, Matrix2x2, Raster, Vector, Vector2ScalarFn, vectorField2scalarField } from '../dist'


describe('makeScalarField', () => {

    const r: Raster = {
        xs: [1, 3/2, 2, 5/2, 3],
        ys: [1, 3/2, 2, 5/2, 3],
    }
    const m: Matrix2x2<number> = [
        [11, 21, 31, 41, 51],
        [12, 22, 32, 42, 52],
        [13, 23, 33, 43, 53],
        [14, 24, 34, 44, 54],
        [15, 25, 34, 45, 55],
    ]
    const sf = makeScalarField(r)(m)
    it('constructs', () => {
        expect(typeof sf).toBe('function')
    })
    it('maps points inside', () => {
        expect(sf(makePoint(1, 1))).toBe(11)
        expect(sf(makePoint(1, 2))).toBe(13)
        expect(sf(makePoint(2, 1))).toBe(31)
        expect(sf(makePoint(3, 3))).toBe(55)
    })
    it('maps points outside', () => {
        expect(sf(makePoint(0, 0))).toBe(11)
        expect(sf(makePoint(0, 2))).toBe(13)
        expect(sf(makePoint(2, 0))).toBe(31)
        expect(sf(makePoint(4, 4))).toBe(55)
    })
    it('need not be square', () => {
        const contours = [1, 3, 5, 7, 9]
        const r: Raster = {
            xs: [10, 20, 30, 40, 50],
            ys: [10, 20, 30, 40],
        }
        const m: Matrix2x2<number> = [
            [10, 10, 8, 3, 2],
            [10,  8, 8, 3, 1],
            [ 8,  8, 4, 2, 1],
            [ 5,  4, 2, 1, 0],
        ]
        const sf = makeScalarField(r)(m)
        expect(sf(makePoint(50, 40))).toBe(0)
        expect(sf(makePoint(30, 30))).toBe(4)
    })
})

describe('makeVectorField', () => {
    const r: Raster = {
        xs: [1, 3/2, 2, 5/2, 3],
        ys: [1, 3/2, 2, 5/2, 3],
    }
    const m: Matrix2x2<Vector> = [
        [makeVector(1, 1), makeVector(2, 1), makeVector(3, 1), makeVector(4, 1), makeVector(5, 1)],
        [makeVector(1, 2), makeVector(2, 2), makeVector(3, 2), makeVector(4, 2), makeVector(5, 2)],
        [makeVector(1, 3), makeVector(2, 3), makeVector(3, 3), makeVector(4, 3), makeVector(5, 3)],
        [makeVector(1, 4), makeVector(2, 4), makeVector(3, 4), makeVector(4, 4), makeVector(5, 4)],
        [makeVector(1, 5), makeVector(2, 5), makeVector(3, 4), makeVector(4, 5), makeVector(5, 5)],
    ]
    const vf = makeVectorField(r)(m)
    it('constructs', () => {
        expect(typeof vf).toBe('function')
    })
    it('maps points inside', () => {
        expect(vf(makePoint(1, 1))).toStrictEqual(makeVector(1, 1))
        expect(vf(makePoint(1, 2))).toStrictEqual(makeVector(1, 3))
        expect(vf(makePoint(2, 1))).toStrictEqual(makeVector(3, 1))
        expect(vf(makePoint(3, 3))).toStrictEqual(makeVector(5, 5))
    })
    it('maps points outside', () => {
        expect(vf(makePoint(0, 0))).toStrictEqual(makeVector(1, 1))
        expect(vf(makePoint(0, 2))).toStrictEqual(makeVector(1, 3))
        expect(vf(makePoint(2, 0))).toStrictEqual(makeVector(3, 1))
        expect(vf(makePoint(4, 4))).toStrictEqual(makeVector(5, 5))
    })
})

describe('vectorField2scalarField', () => {
    it('works for zero function', () => {
        const r: Raster = {
            xs: [1, 3/2, 2, 5/2, 3],
            ys: [1, 3/2, 2, 5/2, 3],
        }
        const m: Matrix2x2<Vector> = [
        [makeVector(1, 1), makeVector(2, 1), makeVector(3, 1), makeVector(4, 1), makeVector(5, 1)],
        [makeVector(1, 2), makeVector(2, 2), makeVector(3, 2), makeVector(4, 2), makeVector(5, 2)],
        [makeVector(1, 3), makeVector(2, 3), makeVector(3, 3), makeVector(4, 3), makeVector(5, 3)],
        [makeVector(1, 4), makeVector(2, 4), makeVector(3, 4), makeVector(4, 4), makeVector(5, 4)],
        [makeVector(1, 5), makeVector(2, 5), makeVector(3, 4), makeVector(4, 5), makeVector(5, 5)],
        ]
        const v2s: Vector2ScalarFn = (v: Vector) => 0
        const vf = makeVectorField(r)(m)
        const sf = vectorField2scalarField(vf)(v2s)(r)
        expect(sf(makePoint(1, 1))).toBe(0)
        expect(sf(makePoint(1, 2))).toBe(0)
        expect(sf(makePoint(2, 1))).toBe(0)
        expect(sf(makePoint(3, 3))).toBe(0)
        expect(sf(makePoint(0, 0))).toBe(0)
        expect(sf(makePoint(0, 2))).toBe(0)
        expect(sf(makePoint(2, 0))).toBe(0)
        expect(sf(makePoint(4, 4))).toBe(0)
    })
})

describe('vectorField2scalarField', () => {
    it('works for concat function', () => {
        const r: Raster = {
            xs: [1, 3/2, 2, 5/2, 3],
            ys: [1, 3/2, 2, 5/2, 3],
        }
        const m: Matrix2x2<Vector> = [
        [makeVector(1, 1), makeVector(2, 1), makeVector(3, 1), makeVector(4, 1), makeVector(5, 1)],
        [makeVector(1, 2), makeVector(2, 2), makeVector(3, 2), makeVector(4, 2), makeVector(5, 2)],
        [makeVector(1, 3), makeVector(2, 3), makeVector(3, 3), makeVector(4, 3), makeVector(5, 3)],
        [makeVector(1, 4), makeVector(2, 4), makeVector(3, 4), makeVector(4, 4), makeVector(5, 4)],
        [makeVector(1, 5), makeVector(2, 5), makeVector(3, 4), makeVector(4, 5), makeVector(5, 5)],
        ]
        const v2s: Vector2ScalarFn = (v: Vector) => ~~`${v.x}${v.y}`
        const vf = makeVectorField(r)(m)
        const sf = vectorField2scalarField(vf)(v2s)(r)
        expect(sf(makePoint(1, 1))).toBe(11)
        expect(sf(makePoint(1, 2))).toBe(13)
        expect(sf(makePoint(2, 1))).toBe(31)
        expect(sf(makePoint(3, 3))).toBe(55)
        expect(sf(makePoint(0, 0))).toBe(11)
        expect(sf(makePoint(0, 2))).toBe(13)
        expect(sf(makePoint(2, 0))).toBe(31)
        expect(sf(makePoint(4, 4))).toBe(55)
    })
})
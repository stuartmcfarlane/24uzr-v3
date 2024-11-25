import { describe, expect, it } from '@jest/globals';
import { makePoint, makePolygon, makeScalarField, Matrix2x2, Polygon, Raster, Scalar, scalarField2contourPolygons } from '../dist';

const normalizePolygon = (p: Polygon) => {
    return p
}
describe('scalarField2contourPolygons', () => {
    it('constructs', () => {
        const contours = [1, 3, 5, 7, 9]
        const r: Raster = {
            xs: [10, 20, 30, 40, 50],
            ys: [10, 20, 30, 40],
        }
        const m: Matrix2x2<Scalar> = [
            [10, 10, 8, 3, 2],
            [10,  8, 8, 3, 1],
            [ 8,  8, 4, 2, 1],
            [ 5,  4, 2, 1, 0],
        ]
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)
        expect(contourPolygons.length).toBe(5)
        expect(contourPolygons[0][0]).toBe(1)
        expect(contourPolygons[1][0]).toBe(3)
        expect(contourPolygons[2][0]).toBe(5)
        expect(contourPolygons[3][0]).toBe(7)
        expect(contourPolygons[4][0]).toBe(9)
    })
    it('finds full field', () => {
        const contours = [1]
        const r: Raster = {
            xs: [10, 20, 30, 40, 50],
            ys: [10, 20, 30, 40],
        }
        const m: Matrix2x2<Scalar> = [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ]
        const expectedPolygon: Polygon = makePolygon(
            [10, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)
        expect(contourPolygons.length).toBe(1)
        expect(contourPolygons[0][0]).toBe(1)
        expect(normalizePolygon(contourPolygons[0][1])).toStrictEqual(normalizePolygon(expectedPolygon))
    })
    it('finds vertical line', () => {
        const contours = [2, 10]
        const r: Raster = {
            xs: [10, 20, 30, 40, 50],
            ys: [10, 20, 30, 40],
        }
        const m: Matrix2x2<Scalar> = [
            [10, 10, 2, 2, 2],
            [10, 10, 2, 2, 2],
            [10, 10, 2, 2, 2],
            [10, 10, 2, 2, 2],
        ]
        const expectedPolygon2 = makePolygon(
            [30, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [30, 40],
            [30, 30],
            [30, 20],
            [30, 10],
        )
        const expectedPolygon10 = makePolygon(
            [10, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)

        expect(contourPolygons.length).toBe(2)
        expect(contourPolygons[0][0]).toBe(2)
        expect(contourPolygons[0][1]).toStrictEqual(expectedPolygon2)
        expect(contourPolygons[1][0]).toBe(10)
        expect(contourPolygons[1][1]).toStrictEqual(expectedPolygon10)
    })
    it('finds internal square', () => {
        const contours = [2, 10]
        const r: Raster = {
            xs: [10, 20, 30, 40, 50],
            ys: [10, 20, 30, 40],
        }
        const m: Matrix2x2<Scalar> = [
            [10, 10, 10, 10, 10],
            [10, 10,  2,  2, 10],
            [10, 10,  2,  2, 10],
            [10, 10, 10, 10, 10],
        ]
        const expectedPolygon2 = makePolygon(
            [30, 20],
            [40, 20],
            [40, 30],
            [30, 30],
            [30, 20],
        )
        const expectedPolygon10 = makePolygon(
            [10, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)

        console.log(`sf(makePoint(50, 10)) =?= 10`, sf(makePoint(50, 10)))
        expect(sf(makePoint(50, 10))).toBe(10)

        expect(contourPolygons.length).toBe(2)
        expect(contourPolygons[0][0]).toBe(2)
        expect(contourPolygons[0][1]).toStrictEqual(expectedPolygon2)
        expect(contourPolygons[1][0]).toBe(10)
        expect(contourPolygons[1][1]).toStrictEqual(expectedPolygon10)
    })
})
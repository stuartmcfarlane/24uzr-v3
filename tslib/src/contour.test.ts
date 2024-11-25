import { describe, expect, it } from '@jest/globals';
import { makePolygon, makeScalarField, Matrix2x2, Polygon, Raster, Scalar, scalarField2contourPolygons } from '../dist';

describe('scalarField2contourPolygons', () => {
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
        const expectedPolygon = [makePolygon(
            [10, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )]
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)
        expect(contourPolygons.length).toBe(1)
        expect(contourPolygons[0][0]).toBe(1)
        expect(contourPolygons[0][1]).toStrictEqual(expectedPolygon)
    })
    it('finds vertical line', () => {
        const contours = [10, 2]
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
        const expectedPolygon2 = [makePolygon(
            [30, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [30, 40],
            [30, 30],
            [30, 20],
            [30, 10],
        )]
        const expectedPolygon10 = [makePolygon(
            [10, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )]
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)

        expect(contourPolygons.length).toBe(2)
        expect(contourPolygons[0][0]).toBe(10)
        expect(contourPolygons[0][1]).toStrictEqual(expectedPolygon10)
        expect(contourPolygons[1][0]).toBe(2)
        expect(contourPolygons[1][1]).toStrictEqual(expectedPolygon2)
    })
    it('finds internal square', () => {
        const contours = [10, 2]
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
        const expectedPolygon2 = [makePolygon(
            [30, 20],
            [40, 20],
            [40, 30],
            [30, 30],
            [30, 20],
        )]
        const expectedPolygon10 = [makePolygon(
            [10, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )]
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)

        expect(contourPolygons.length).toBe(2)
        expect(contourPolygons[0][0]).toBe(10)
        expect(contourPolygons[0][1]).toStrictEqual(expectedPolygon10)
        expect(contourPolygons[1][0]).toBe(2)
        expect(contourPolygons[1][1]).toStrictEqual(expectedPolygon2)
    })
    it('finds multiple vertical squares', () => {
        const contours = [10, 2]
        const r: Raster = {
            xs: [10, 20, 30, 40, 50],
            ys: [10, 20, 30, 40, 50, 60, 70],
        }
        const m: Matrix2x2<Scalar> = [
            [10, 10, 10, 10, 10],
            [10, 10,  2,  2, 10],
            [10, 10,  2,  2, 10],
            [10, 10, 10, 10, 10],
            [10, 10,  2,  2, 10],
            [10, 10,  2,  2, 10],
            [10, 10, 10, 10, 10],
        ]
        const expectedPolygon2 = [
            makePolygon(
                [30, 20],
                [40, 20],
                [40, 30],
                [30, 30],
                [30, 20],
            ),
            makePolygon(
                [30, 50],
                [40, 50],
                [40, 60],
                [30, 60],
                [30, 50],
            ),
        ]
        const expectedPolygon10 = [makePolygon(
            [10, 10],
            [50, 10],
            [50, 20],
            [50, 30],
            [50, 40],
            [50, 50],
            [50, 60],
            [50, 70],
            [10, 70],
            [10, 60],
            [10, 50],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )]
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)

        expect(contourPolygons.length).toBe(2)
        expect(contourPolygons[0][0]).toBe(10)
        expect(contourPolygons[0][1]).toStrictEqual(expectedPolygon10)
        expect(contourPolygons[1][0]).toBe(2)
        expect(contourPolygons[1][1]).toStrictEqual(expectedPolygon2)
    })
    it('finds wrapped square', () => {
        const contours = [10, 2]
        const r: Raster = {
            xs: [10, 20, 30, 40, 50, 60],
            ys: [10, 20, 30, 40, 50, 60],
        }
        const m: Matrix2x2<Scalar> = [
            [ 2,  2,  2,  2,  2, 2],
            [ 2, 10, 10, 10, 10, 2],
            [ 2, 10,  2,  2, 10, 2],
            [ 2, 10,  2,  2, 10, 2],
            [ 2, 10, 10, 10, 10, 2],
            [ 2,  2,  2,  2,  2, 2],
        ]
        const expectedPolygon2 = [
            makePolygon(
                [10, 10],
                [60, 10],
                [60, 20],
                [60, 30],
                [60, 40],
                [60, 50],
                [60, 60],
                [10, 60],
                [10, 50],
                [10, 40],
                [10, 30],
                [10, 20],
                [10, 10],
            ),
            makePolygon(
                [30, 30],
                [40, 30],
                [40, 40],
                [30, 40],
                [30, 30],
            ),
        ]
        const expectedPolygon10 = [makePolygon(
            [10, 10],
            [60, 10],
            [60, 20],
            [60, 30],
            [60, 40],
            [60, 50],
            [60, 60],
            [10, 60],
            [10, 50],
            [10, 40],
            [10, 30],
            [10, 20],
            [10, 10],
        )]
        const sf = makeScalarField(r)(m)
        const contourPolygons = scalarField2contourPolygons(contours)(r)(sf)

        expect(contourPolygons.length).toBe(2)
        expect(contourPolygons[0][0]).toBe(10)
        expect(contourPolygons[0][1]).toStrictEqual(expectedPolygon10)
        expect(contourPolygons[1][0]).toBe(2)
        expect(contourPolygons[1][1]).toStrictEqual(expectedPolygon2)
    })
})
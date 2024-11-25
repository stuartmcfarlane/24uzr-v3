import { describe, expect, it } from '@jest/globals';
import { makeScalarField, Matrix2x2, Raster, Scalar, scalarField2contourPolygons } from '../dist';

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
        const contourPolygons = scalarField2contourPolygons(contours)(sf)
        expect(contourPolygons.length).toBe(5)
    })
})
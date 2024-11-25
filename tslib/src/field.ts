import { Polygon } from './contour';
import { fmtReal } from './fmt';
import { makePoint, Point } from './graph';
import { isPointInPolygon } from './polygon';
import { Vector } from './vector';

export type Matrix2x2<T> = T[][]
type IJ = {
    i: number
    j: number
}
export type Scalar = number
export type Field<T> = (p: Point) => T
export type InterpolatedField<T> = (f: Field<T>) => Field<T>
export type VectorField = Field<Vector>
export type ScalarField = Field<Scalar>
export type Vector2ScalarFn = (v: Vector) => Scalar
export type Raster = {
    xs: number[]
    ys: number[]
}
type RasterInstance = Raster & {
    x0: number
    xδ: number
    xω: number
    y0: number
    yδ: number
    yω: number
}
const raster2rasterInstance = ({xs, ys}: Raster): RasterInstance => ({
    xs,
    ys,
    x0: xs[0],
    xδ: xs[1] - xs[0],
    xω: xs.length - 1,
    y0: ys[0],
    yδ: ys[1] - ys[0],
    yω: ys.length - 1,
})

const rasterPoint = (ri: RasterInstance) => ({x, y}: Point): IJ => {
    const i = (x - ri.x0) / ri.xδ
    const j = (y - ri.y0) / ri.yδ
    return {
        j: Math.min(ri.yω, Math.max(j, 0)),
        i: Math.min(ri.xω, Math.max(i, 0)),
    }
}

const makeField = <T>(r: Raster) => (m: Matrix2x2<T>) => {
    const ri = raster2rasterInstance(r)
    const f: Field<T> = (p: Point): T => {
        const { i, j } = rasterPoint(ri)(p)
        return m[j][i]
    }
    return f
}

export const makeScalarField = makeField<Scalar>

export const makeVectorField = makeField<Vector>

export const vectorField2scalarField = (vf: VectorField) => (v2s: Vector2ScalarFn) => (r: Raster): ScalarField => {
    const sMatrix = r.ys.map(
        (y: number) => r.xs.map(
            (x: number) => v2s(vf(makePoint(x, y)))
        )
    )
    return makeScalarField(r)(sMatrix)
}

export const removePolygonFromScalarField = (sentinelValue: Scalar) => (r: Raster) => (sf: ScalarField) => (polygon: Polygon): ScalarField => {
    const sMatrix = r.ys.map(
        (y: number) => r.xs.map(
            (x: number) => isPointInPolygon(polygon)(makePoint(x, y)) ? sentinelValue : sf(makePoint(x, y))
        )
    )
    return makeScalarField(r)(sMatrix)
}

export const fmtScalarField = (r: Raster) => (sf: ScalarField) => {
    return r.ys.map(y => r.xs.map(x => sf(makePoint(x, y))))
}
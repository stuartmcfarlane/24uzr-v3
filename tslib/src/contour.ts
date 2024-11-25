import { fmtScalarField, Raster, removePolygonFromScalarField, Scalar, ScalarField } from "./field"
import { reverse } from "./fp"
import { makePoint, Point } from "./graph"
import { Polygon } from "./polygon"

export {Polygon}
export type Contours = Scalar[]
export type Contour = [Scalar, Polygon[]]
export type ContourPolygons = Contour[]

export const makePolygon = (...ps: number[][]) => ps.map(([x, y]) => makePoint(x, y))

const REMOVED_POLYGON_VALUE = -666

const scalarField2contourPolygon = (contour: Scalar) => (r: Raster) => (sf: ScalarField): Polygon[] => {
    console.log(`>scalarField2contourPolygon`)
    console.log(` scalarField2contourPolygon sf`, fmtScalarField(r)(sf))
    let gettingPolygon = false
    let gotPolygon = false
    let inside = false
    let starts = new Array<number|undefined>(r.ys.length)
    let ends = new Array<number | undefined>(r.ys.length)
    let points: Point[] = []
    r.ys.forEach(
        (y, j) => {
            r.xs.forEach(
                (x) => {
                    const scalar = sf(makePoint(x, y))
                    if (gotPolygon) return
                    if (REMOVED_POLYGON_VALUE === scalar) return
                    if (scalar <= contour) {
                        // contour === 2 && console.log(`(${x}, ${y}): ${sf(makePoint(x, y))} <= ${contour}`)
                        if (!inside) {
                            inside = true
                            gettingPolygon = true
                            starts[j] = x
                        }
                        if (inside) {
                            ends[j] = x
                        }
                    }
                    else {
                        if (inside) {
                            inside = false
                        }
                    }
                }
            )
            if (gettingPolygon && !starts[j] && !ends[j]) {
                gotPolygon = true
            }
            if (!starts[j] && ends[j]) {
                // console.log(`fix start ${j}`, starts, ends)
                starts[j] = r.xs[0]
            }
            if (starts[j] && !ends[j]) {
                // console.log(`fix end ${j}`, starts, ends)
                ends[j] = r.xs[r.xs.length - 1]
            }
            inside = false
        }
    )
    r.ys.forEach(
        (y, j) => {
            if (points.length == 0 && starts[j]) {
                points.push(makePoint(starts[j], y))
            }
            if (ends[j]) {
                points.push(makePoint(ends[j], y))
            }
        }
    )
    reverse(r.ys).forEach(
        (y, j_) => {
            const j = r.ys.length - j_ - 1
            if (starts[j]) {
                points.push(makePoint(starts[j], y))
            }
        }
    )
    console.log(` scalarField2contourPolygon points`, points)
    if (!points.length) {
        console.log(`<scalarField2contourPolygon done`)
        return []
    }
    console.log(` scalarField2contourPolygon going again`)
    const polygons = [
        points,
        ...scalarField2contourPolygon(contour)(r)(removePolygonFromScalarField(REMOVED_POLYGON_VALUE)(r)(sf)(points))
    ]
    console.log(`<scalarField2contourPolygon`, polygons)
    return polygons
}

export const scalarField2contourPolygons = (contours: Scalar[]) => (r: Raster) => (sf: ScalarField): ContourPolygons => {
    return contours.map(
        (c: Scalar) => ([c, scalarField2contourPolygon(c)(r)(sf)])
    )
}
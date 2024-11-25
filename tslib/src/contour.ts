import { Raster, Scalar, ScalarField } from "./field"
import { reverse } from "./fp"
import { makePoint, Point } from "./graph"

export type Contours = Scalar[]
export type Polygon = Point[]
export type Contour = [Scalar, Polygon]
export type ContourPolygons = Contour[]

export const makePolygon = (...ps: number[][]) => ps.map(([x, y]) => makePoint(x, y))

const scalarField2contourPolygon = (contour: Scalar) => (r: Raster) => (sf: ScalarField): Polygon => {
    let inside = false
    let starts = new Array<number|undefined>(r.ys.length)
    let ends = new Array<number | undefined>(r.ys.length)
    let points: Point[] = []
    r.ys.forEach(
        (y, j) => {
            r.xs.forEach(
                (x) => {
                    if (sf(makePoint(x, y)) <= contour) {
                        // contour === 2 && console.log(`(${x}, ${y}): ${sf(makePoint(x, y))} <= ${contour}`)
                        if (!inside) {
                            inside = true
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
    return points
}

export const scalarField2contourPolygons = (contours: Scalar[]) => (r: Raster) => (sf: ScalarField): ContourPolygons => {
    return contours.map(
        (c: Scalar) => ([c, scalarField2contourPolygon(c)(r)(sf)])
    )
}
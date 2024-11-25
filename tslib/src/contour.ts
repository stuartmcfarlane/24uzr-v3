import { Scalar, ScalarField } from "./field"
import { Point } from "./graph"

export type Contours = Scalar[]
export type Polygon = Point[]
export type Contour = [Scalar, Polygon]
export type ContourPolygons = Contour[]

export const scalarField2contourPolygons = (contours: Scalar[]) => (sf: ScalarField): ContourPolygons => {
    return []
}
import { Line, lineSlope, makeLine, makePoint, Point } from "./graph"
import { last } from './fp';
import { realEq } from "./math";
import { vectorRotate } from "./vector";
import { splitArray } from "./array";
import { fmtLine } from "./fmt";

export type Polygon = Point[]

const ε = 0.0001

const polygon2lines = (polygon: Polygon): Line[] => {
    const polygon2linesReducer = (lines: Line[], point: Point): Line[] => {
        const [,end] = last(lines)
        if (!end) return lines
        return [
            ...lines,
            [end, point],
        ]
    }
    const [p1, p2, ...tail] = polygon
    return tail.reduce(polygon2linesReducer, [[p1, p2]])
}
const lineIntersection = ([a1, a2]: Line, [b1, b2]: Line): Point | undefined => {
    console.log(`lineIntersection`, a1, a2, b1, b2)
    const ma = lineSlope(a1, a2)
    const mb = lineSlope(b1, b2)
    console.log(`lineIntersection slopes`, ma, mb)
    if (isNaN(ma) || isNaN(mb)) return undefined
    if (ma === Infinity && mb === Infinity) return undefined
    if (realEq(ε)(ma, mb)) {
        // parallel lines, is point on line?
        return undefined
    }
    if (ma === Infinity || ma === -Infinity) {
        const cb = b1.y - mb * b1.x
        const px = a1.x
        const py = mb * px + cb
        return makePoint(px, py)
    }
    if (mb === Infinity || mb === -Infinity) {
        const ca = a1.y - ma * a1.x
        const px = b1.x
        const py = ma * px + ca
        return makePoint(px, py)
    }
    const ca = a1.y - ma * a1.x
    const cb = b1.y - mb * b1.x
    const px = (cb - ca) / (ma - mb)
    const py = ma * px + ca
    return makePoint(px, py)
}
const isVertical = ({ x: x1 }: Point, { x: x2 }: Point) => realEq(ε)(0, x2 - x1)
const isInInterval = ([a1,a2]: [number, number],c: number) => {
    if (a2 < a1) [a1, a2] = [a2, a1]
    return a1 < c && c < a2 || realEq(ε)(c, a1) || realEq(ε)(c, a2)
}
const makeLinearFunction = ([a1, a2]: Line) => {
    const m = lineSlope(a1, a2)
    const c = a1.y - a1.x * m
    const f = (x: number) => m * x + c
    return f
}
const isPointInLineSegment = ([p1, p2]: Line, p: Point) => {
    console.log(`>isPointInLineSegment`, p, [p1, p2])
    if (isVertical(p1, p2)) {
        const [P1, P2, P] = [p1, p2, p].map(vectorRotate(Math.PI/2))
        return isPointInLineSegment([P1, P2], P)
    }
    const {x: x1} = p1
    const {x: x2} = p2
    const {x, y} = p
    console.log(` isPointInLineSegment in interval`, x, [x1, x2], isInInterval([x1, x2], x))
    if (!isInInterval([x1, x2], x)) return false
    const f = makeLinearFunction([p1, p2])
    console.log(` isPointInLineSegment on line`, x, y, f(x), realEq(ε)(f(x), y))
    return realEq(ε)(f(x), y)
}
const min = (a: number, b: number) => (
    b === undefined ? a : a < b ? a : b
)
const max = (a: number, b: number) => (
    b === undefined ? a : a > b ? a : b
)
const isCoincidentLine = ([a1, a2]: Line) => ([b1, b2]: Line) => {
    // rotate all 90deg if A is vertical to avoid dividing by zero
    if (isVertical(a1, a2)) {
        console.log(`rotating ${fmtLine(makeLine(a1, a2))}`)
        const A = [a1, a2].map(vectorRotate(Math.PI/2)) as Line
        const B = [b1, b2].map(vectorRotate(Math.PI/2)) as Line
        return isCoincidentLine(A)(B)
    }
    const f = makeLinearFunction([a1, a2])
    const isOnLine = ({x, y}: Point) => realEq(ε)(f(x), y)
    return isOnLine(b1) && isOnLine(b2)
}
const mergeColinear = (lines: Line[]): Line[] => {
    if (!lines?.length) return []
    const [head, ...tail] = lines
    const [colinear, todo] = splitArray(isCoincidentLine(head))(tail)
    if (!colinear.length) return [
        head,
        ...mergeColinear(todo)
    ]
    const toMerge = [head, ...colinear]
    
    const merged = makeLine(
        makePoint(
            toMerge.flatMap(([p1, p2]) => [p1.x, p2.x]).reduce(min),
            toMerge.flatMap(([p1, p2]) => [p1.y, p2.y]).reduce(min),
        ),
        makePoint(
            toMerge.flatMap(([p1, p2]) => [p1.x, p2.x]).reduce(max),
            toMerge.flatMap(([p1, p2]) => [p1.y, p2.y]).reduce(max),
        ),
     )
    return [
        merged,
        ...mergeColinear(todo)
    ]
}
/**
 * https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
 */
export const isPointInPolygon = (polygon: Polygon) => (point: Point) => {
    console.log(`>isPointInPolygon`, polygon, point)
    const lines = mergeColinear(polygon2lines(polygon))
    console.log(` isPointInPolygon lines`, lines)
    const maxX = polygon.slice(1).reduce((max, {x}) => Math.max(x, max), polygon[0].x)
    console.log(` isPointInPolygon maxX`, maxX)
    const {x, y} = point
    if (x > maxX) return false
    const ray = makeLine(
        point,
        makePoint(maxX + 1, y)
    )
    console.log(` isPointInPolygon ray`, ray)
    const onBoundary = lines.reduce(
        (onBoundary: boolean, line: Line) => {
            return onBoundary || isPointInLineSegment(line, point) 
        },
        false
    )
    if (onBoundary) {
        console.log(`<isPointInPolygon on boundary`)
        return true
    }
    const count = lines.reduce(
        (count: number, line: Line) => {
            console.log(` isPointInPolygon line`, line)
            const intersection = lineIntersection(ray, line)
            console.log(` isPointInPolygon intersection`, intersection)
            const inc = intersection && isPointInLineSegment(ray, intersection) && isPointInLineSegment(line, intersection) ? 1 : 0
            console.log(` isPointInPolygon intersection?`, !!inc)
            return count + inc
        },
        0
    )
    console.log(` isPointInPolygon count`, count)
    const inside = !!(count % 2)
    console.log(`<isPointInPolygon intersection`, inside)
    return inside    
}

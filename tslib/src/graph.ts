import { LatLng } from "./geo"
import { realEq } from "./math"
import { Vector, vectorAdd, vectorScale } from "./vector"

export type Point = {
    x: number
    y: number
}
export type Rect = [
    Point,
    Point
]

export type Line = [Point, Point]

export const makePoint = (x: number, y: number) => ({ x, y })
export const makeRectSafe = (p1: Point, p2: Point): Rect => makeRect(
    Math.min(p1.x, p2.x),
    Math.min(p1.y, p2.y),
    Math.abs(p1.x - p2.x),
    Math.abs(p1.y - p2.y),
)
export const makeRect = (x: number, y: number, width: number, height: number):Rect => [
    makePoint(x, y),
    makePoint(x + width, y + height),
]
export const makeLine = (p1: Point, p2: Point): Line => [p1, p2]
export const rectPoint = (rect: Rect): Point => rect[0]
export const rectWidth = ([{ x: x1 }, { x: x2 }]: Rect): number => x2 - x1
export const rectArea = (rect?: Rect) => !rect ? 0 : rectWidth(rect) * rectHeight(rect)
export const rectHeight = ([{ y: y1, }, { y: y2, }]: Rect): number => y2 - y1
export const rectAspectRatio = (rect?: Rect) => (
    rect
    ? rectWidth(rect) / rectHeight(rect)
    : 1
)
export const rectCenter = (rect: Rect): Point => (
    vectorAdd(
        rectPoint(rect),
        makePoint(rectWidth(rect)/2, rectHeight(rect)/2)
    )
)
export const points2boundingRect = (points: Point[]): Rect => {
    return points.reduce(
        (boundingRect: Rect, point: Point): Rect => {
            if (!boundingRect) return [point, point]
            const { x, y } = point
            const [
                {
                    x: x1,
                    y: y1,
                },{
                    x: x2,
                    y: y2,
                }
            ] = boundingRect
            return [
                {
                    x: Math.min(x, x1),
                    y: Math.min(y, y1),
                },{
                    x: Math.max(x, x2),
                    y: Math.max(y, y2),
                }
            ]
        },
        [
            {
                x: Infinity,
                y: Infinity,
            },{
                x: -Infinity,
                y: -Infinity,
            }
        ]
    )
}
const PERCENT_MARGIN_REGEX = /^(\d+(?:\.\d+)?)%(?:,(\d+(?:\.\d+)?))?$/
const parseMargin = (maybeMargin: number | string, rect: Rect): number => {
    if (typeof maybeMargin === 'number') return maybeMargin
    const percentMatch = PERCENT_MARGIN_REGEX.exec(maybeMargin)
    if (percentMatch) {
        const [
            ,
            percentString,
            minString
        ] = percentMatch
        const percent = parseFloat(percentString)
        const min = minString ? parseFloat(minString) : 0
        const [
            {
                x: x1,
                y: y1,
            }, {
                x: x2,
                y: y2,
            }
        ] = rect
        const width = x2 - x1
        const margin = width * percent / 100
        return Math.max(margin, min)
    }
    return parseFloat(maybeMargin)
}
export const rectGrowMargin = (maybeMargin: number | string, rect: Rect): Rect => {
    const margin = parseMargin(maybeMargin, rect)
    return rectGrow(margin, rect)
}
export const rectGrow = (margin_: number, rect: Rect): Rect => {
    const width = rectWidth(rect)
    const height = rectHeight(rect)
    const margin = (
        width < 2 * margin_ || height < 2 * margin_
            ? Math.min(width, height)
            : margin_
    )
    const α = rectAspectRatio(rect)
    const dX = (
        α >= 1
            ? margin
            : margin / α
    )
    const dY = (
        α >= 1
            ? margin / α
            : margin
    )
    const [
        {
            x: x1,
            y: y1,
        }, {
            x: x2,
            y: y2,
        }
    ] = rect
    return [
        {
            x: x1 - dX,
            y: y1 - dY,
        }, {
            x: x2 + dX,
            y: y2 + dY,
        }
    ]
}
export const fitToClient = (boundingRect: Rect, clientRect?: Rect): Rect => {
    if (!clientRect) return boundingRect
    const a = rectAspectRatio(boundingRect)
    const A = rectAspectRatio(clientRect)
    const [
        {
            x: x1,
            y: y1,
        },{
            x: x2,
            y: y2,
        }
    ] = boundingRect
    if (a < A) {
        const width = rectWidth(boundingRect)
        const newWidth = width * A / a
        const delta = (newWidth - width) / 2
        return [
            {
                x: x1 - delta,
                y: y1,
            },{
                x: x2 + delta,
                y: y2,
            }
        ]
    }
    if (a > A) {
        const height = rectHeight(boundingRect)
        const newHeight = height * a / A
        const delta = (newHeight - height) / 2
        return [
            {
                x: x1,
                y: y1 - delta,
            },{
                x: x2,
                y: y2 + delta,
            }
        ]
    }
    return boundingRect
}
export const rect2viewBox = (rect?: Rect) => {
    if (!rect) {
        return {}
    }
    const [
        {
            x: x1,
            y: y1,
        }, {
            x: x2,
            y: y2,
        }
    ] = rect
    return { viewBox: `${x1} ${y1} ${x2 - x1} ${y2 - y1}` }
}

export const points2vector = (p1: Point, p2: Point): Vector => ({ x: p2.x - p1.x, y: p2.y - p1.y })
export const pointTranslate = (v: Vector) => (p: Point): Point => ({ x: p.x + v.x, y: p.y + v.y})
export const rectTranslate = (v: Vector) => (r: Rect): Rect => {
    const [
        {
            x: x1,
            y: y1,
        }, {
            x: x2,
            y: y2,
        }
    ] = r
    return [
        {
            x: x1 + v.x,
            y: y1 + v.y,
        }, {
            x: x2 + v.x,
            y: y2 + v.y,
        }
    ]
}
export const rectGrowAroundPoint = (
    margin: number,
    point: Point,
    rect: Rect
): Rect => {
    const vCenter = points2vector(point, rectCenter(rect))
    const centeredRect = rectTranslate(vCenter)(rect)
    const α1 = rectAspectRatio(centeredRect) 
    const grownRect = rectGrow(margin, centeredRect)
    const α2 = rectAspectRatio(grownRect)
    if (!realEq(0.0001)(α1, α2)) {
    }
    if (rectWidth(grownRect) <= 0 || rectHeight(grownRect) <= 0) {
        return rect
    }
    const vRecenter = vectorScale(-rectWidth(rect) / rectWidth(grownRect))(vCenter)
    const resultRect = rectTranslate(vRecenter)(grownRect)
    return resultRect
}
export const rectLimitTo = (limitRect: Rect, rect: Rect): Rect => {
    if (rectWidth(rect) > rectWidth(limitRect)) return limitRect
    const [
        {
            x: limitX1,
            y: limitY1,
        }, {
            x: limitX2,
            y: limitY2,
        }
    ] = limitRect
    const [
        {
            x: x1,
            y: y1,
        }, {
            x: x2,
            y: y2,
        }
    ] = rect
    const result: Rect = [
        {
            x: Math.max(limitX1, x1),
            y: Math.max(limitY1, y1),
        }, {
            x: Math.min(limitX2, x2),
            y: Math.min(limitY2, y2),
        }
    ]
    return result
}
export const pointInRect = (rect?: Rect) => (point: Point) => {
    if (!rect) return false
    return rect[0].x <= point.x && point.x <= rect[1].x
        && rect[0].y <= point.y && point.y <= rect[1].y
}

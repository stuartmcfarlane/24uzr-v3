import { vectorAdd } from "./vector"
import { RefObject } from "react"

export const makePoint = (x: number, y: number) => ({ x, y })
export const makeRect = (x: number, y: number, width: number, height: number):Rect => [
    makePoint(x, y),
    makePoint(x + width, y + height),
]
export const makeLine = (p1: Point, p2: Point): Line => [ p1, p2 ]
export const latLng2canvas = ({ lat, lng }: LatLng): Point => {
    return {
        x: lng * 100,
        y: lat * -100,
    }
}
export const fmtUndefined = () => '<undefined>'
export const fmtReal = (n: number, precision: number = 2) => n.toFixed(precision)
export const fmtPoint = (point?: Point) => (
    point
    ? `(${fmtReal(point.x)}, ${fmtReal(point.y)})`
    : fmtUndefined()
)
export const fmtVector = (point?: Point) => (
    point
    ? `[${fmtReal(point.x)}, ${fmtReal(point.y)}]`
    : fmtUndefined()
)
export const fmtRect = (rect?: Rect) => (
    rect
    ? `<Rect ${fmtPoint(rectPoint(rect))} w ${fmtReal(rectWidth(rect))} h ${fmtReal(rectHeight(rect))}>`
    : fmtUndefined()
)
export const fmtLine = (line?: Line) => (
    line
    ? `<Line ${fmtPoint(line[0])} -> ${fmtPoint(line[1])}>`
    : fmtUndefined()
)
export const rectPoint = (rect: Rect): Point => rect[0]
export const rectWidth = ([ { x: x1 },{ x: x2 } ]: Rect): number => x2 - x1
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
            x: x1 - margin,
            y: y1 - margin,
        }, {
            x: x2 + margin,
            y: y2 + margin,
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

export const domRect2rect = (domRect?: DOMRect): Rect | undefined => {
    if (!domRect) return undefined
    const { x, y, width, height } = domRect
    return [
        {
            x,
            y,
        }, {
            x: x + width,
            y: y + height,
        }
    ]
}

export const rect2SvgRect = (rect: Rect) => {
    const point = rectPoint(rect)
    return {
        x: point.x,
        y: point.y,
        width: rectWidth(rect),
        height: rectHeight(rect),
    }
}
export const line2SvgLine = (line: Line) => {
    const [p1, p2] = line
    return {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
    }
}
export const makeScreen2svgFactor = (svgRef: RefObject<SVGSVGElement>): number => {
    console.log(`>makeScreen2svgFactor`, svgRef)
    if (!svgRef.current) return 1
    const svgP1 = clientPoint2svgPoint(svgRef.current, makePoint(0, 0))
    const svgP2 = clientPoint2svgPoint(svgRef.current, makePoint(100, 0))
    if (!svgP1 || !svgP2) return 1
    const svg100 = svgP2.x - svgP1.x
    const factor =  svg100 / 100
    console.log(`<makeScreen2svgFactor ${fmtReal(svg100, 0)} / 100 ${fmtReal(factor)}`)
    return factor
}
// export const makeScreen2svgFactor = (svgRect: Rect, clientRect: Rect) => {
//     const aSvg = rectAspectRatio(svgRect)
//     const aClient = rectAspectRatio(clientRect)
//     if (realEq(0.01)(aSvg, aClient) || aSvg < aClient) {
//         const factor = rectWidth(svgRect) / rectWidth(clientRect)
//         return factor
//     }
//     const factor = rectHeight(svgRect) / rectHeight(clientRect)
//     return factor
// }
export const screenUnits2canvasUnits = (factor: number = 1, screenUnits: number): number => {
    return screenUnits * (factor || 1)
}
export const clientPoint2svgPoint = (svg: SVGSVGElement | null, clientPoint: Point): Point | undefined => {
    if (!svg) return undefined
    const svgPoint = svg.createSVGPoint()
    
    svgPoint.x = clientPoint.x
    svgPoint.y = clientPoint.y
    
    const screenCTM = svg.getScreenCTM()
    if (!screenCTM) return undefined

    return svgPoint.matrixTransform(svg.getScreenCTM()?.inverse()) as Point
}

export const points2vector = (p1: Point, p2: Point): Vector => ({ x: p2.x - p1.x, y: p2.y - p1.y })
export const rectTranslate = (v: Vector, r: Rect): Rect => {
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
export const vectorScale = (s: number, v: Vector): Vector => ({ x: s * v.x, y: s * v.y})
export const rectGrowAroundPoint = (
    margin: number,
    point: Point,
    rect: Rect
): Rect => {
    const vCenter = points2vector(point, rectCenter(rect))
    const centeredRect = rectTranslate(vCenter, rect)
    const grownRect = rectGrow(margin, centeredRect)
    if (rectWidth(grownRect) <= 0 || rectHeight(grownRect) <= 0) {
        return rect
    }
    const vRecenter = vectorScale(-rectWidth(rect) / rectWidth(grownRect), vCenter)
    const resultRect = rectTranslate(vRecenter, grownRect)
    return resultRect
}
export const rectLimitTo = (limitRect: Rect, rect: Rect): Rect => {
    console.log(`>rectLimitTo ${fmtRect(limitRect)} ${fmtRect(rect)}`)
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
    console.log(`<rectLimitTo ${fmtRect(result)}`)
    return result
}
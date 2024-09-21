export const latLng2canvas = ({ lat, lng }: LatLng): Point => {
    return {
        x: lat * 1000,
        y: lng * 1000,
    }
}
export const fmtUndefined = () => '<undefined>'
export const fmtReal = (n: number) => n.toFixed(2)
export const fmtPoint = (point?: Point) => (
    point
    ? `(${fmtReal(point.x)}, ${fmtReal(point.y)})`
    : fmtUndefined()
)
export const fmtRect = (rect?: Rect) => (
    rect
    ? `<Rect ${fmtPoint(rectPoint(rect))} w ${fmtReal(rectWidth(rect))} h ${fmtReal(rectHeight(rect))}>`
    : fmtUndefined()
)
export const rectPoint = ([point]: Rect): Point => point
export const rectWidth = ([ { x: x1 },{ x: x2 } ]: Rect): number => x2 - x1
export const rectHeight = ([{ y: y1, }, { y: y2, }]: Rect): number => y2 - y1
export const rectAspectRatio = (rect?: Rect) => (
    rect
    ? rectWidth(rect) / rectHeight(rect)
    : 1
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
const parseMargin = (maybeMargin: number | string, rect: Rect): number => {
    if (typeof maybeMargin === 'number') return maybeMargin
    if (/^\d+%$/.test(maybeMargin)) {
        const percent = parseFloat(maybeMargin)
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
        return width * percent / 100
    }
    return parseFloat(maybeMargin)
}
export const growRect = (maybeMargin: number | string, rect: Rect): Rect => {
    const margin = parseMargin(maybeMargin, rect)
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
    if (!rect) return {}
    // if (!rect) return '0 0 100 100'
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
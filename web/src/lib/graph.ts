export const latLng2canvas = ({ lat, lng }: LatLng): Point => {
    return {
        x: lat * 1000,
        y: lng * 1000,
    }
}

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
export const rect2viewBox = ([
    {
        x: x1,
        y: y1,
    },{
        x: x2,
        y: y2,
    }
]: Rect): string => `${x1} ${y1} ${x2-x1} ${y2-y1}`
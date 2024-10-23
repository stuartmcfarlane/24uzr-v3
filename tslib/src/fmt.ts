import { Line, Point, Rect, rectHeight, rectPoint, rectWidth } from "./graph"

export const fmtNM = (n: number) => `${fmtReal(n, 1)} nM`
export const fmtUndefined = () => '<undefined>'
export const fmtReal = (n: number, precision: number = 4) => n.toFixed(precision)
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
export const fmtTimestamp = (timestamp: string) => {
    const formatter = new Intl.DateTimeFormat('nl-NL', { dateStyle: 'short', timeStyle: 'medium' });
    return formatter.format(new Date(timestamp))
}
export const fmtDegrees = (θ: number) => `${fmtReal(θ, 0)}°`
export const fmtKnots = (kts: number, precision: number = 1) => `${fmtReal(kts, precision)}kts`
export const fmtWindSpeed = (kts: number) => fmtKnots(kts, 0)
export const fmtBoatSpeed = (kts: number) => fmtKnots(kts, 1)
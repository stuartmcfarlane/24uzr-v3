import { Line, Point, Rect, rectHeight, rectPoint, rectWidth } from "./graph"
import { Timestamp, timestamp2date } from './time';

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
export const fmtHoursMinutes = (timestamp: Timestamp) => {
    const date = timestamp2date(timestamp)
    const h = date.getHours()
    const m = date.getMinutes()
    return `${h}:${fmtLeftPad(2, '0')(m)}`
}
export const fmtHumanTime = (timestamp: Timestamp) => {
    const dateFormatter = new Intl.DateTimeFormat('nl-NL', {
        // localeMatcher?: "best fit" | "lookup" | undefined;
        weekday: 'long', //"long" | "short" | "narrow" | undefined;
        // era?: "long" | "short" | "narrow" | undefined;
        // year?: "numeric" | "2-digit" | undefined;
        // month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
        // day?: "numeric" | "2-digit" | undefined;
        hour: '2-digit', // "numeric" | "2-digit" | undefined;
        minute: '2-digit', // "numeric" | "2-digit" | undefined;
        // second?: "numeric" | "2-digit" | undefined;
        // timeZoneName?: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined;
        // formatMatcher?: "best fit" | "basic" | undefined;
        // hour12?: boolean | undefined;
        // timeZone?: string | undefined;
})
    const formattedDate = dateFormatter.format(timestamp2date(timestamp))
    return formattedDate
}
export const fmtLeftPad = (n: number, pad: string) => (v: string | number) => {
    const vv = `${v}`
    if (vv.length >= n) return vv
    return `${pad}${fmtLeftPad(n-1, pad)(vv)}`

}

export const fmtTwa = (twa: number) => {
    if (twa > 180) twa = twa - 180
    return twa < 0
        ? `${fmtDegrees(-twa)} pt`
        : twa > 0 
        ? `${fmtDegrees(twa)} sb`
        : fmtDegrees(twa)
            
}
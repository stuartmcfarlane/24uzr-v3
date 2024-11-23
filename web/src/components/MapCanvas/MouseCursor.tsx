import { CURSOR_FONT_SIZE, CURSOR_SIZE, CURSOR_TEXT_OFFSET, CURSOR_SHOW_WIND, SHOW_CURSOR } from "@/lib/constants"
import { fmtLatLng } from "@/lib/geo"
import { canvas2latLng, line2SvgLine, screenUnits2canvasUnits } from "@/lib/graph"
import { IndexedWind, windAtLocation, vectorAdd, makeLine, makePoint, Point, Line, fmtWind, fmtVector } from 'tslib'

export type MouseCursorProps = {
    point: Point
    screen2svgFactor: number
    wind?: IndexedWind
}

const MouseCursor = (props: MouseCursorProps) => {
    if (!SHOW_CURSOR) return <></>
    const {
        point,
        screen2svgFactor,
        wind,
    } = props
    const one = screenUnits2canvasUnits(screen2svgFactor, 1)
    const size = screenUnits2canvasUnits(screen2svgFactor, CURSOR_SIZE)
    const { x, y } = point
    const lines = [
        makeLine(makePoint(x - size, y), makePoint(x - one, y)),
        makeLine(makePoint(x, y - size), makePoint(x, y - one)),
        makeLine(makePoint(x + one, y), makePoint(x + size, y)),
        makeLine(makePoint(x, y + one), makePoint(x, y + size)),
    ]
    const latLngTextOffset = makePoint(screenUnits2canvasUnits(
        screen2svgFactor, CURSOR_TEXT_OFFSET.x),
        screenUnits2canvasUnits(screen2svgFactor, CURSOR_TEXT_OFFSET.y)
    )
    const windTextOffset = makePoint(screenUnits2canvasUnits(
        screen2svgFactor, CURSOR_TEXT_OFFSET.x),
        screenUnits2canvasUnits(screen2svgFactor, (5/2) * CURSOR_TEXT_OFFSET.y)
    )
    const latLng = canvas2latLng(point)
    const vWind = wind && windAtLocation(wind, latLng)
    const fontSize = screenUnits2canvasUnits(screen2svgFactor, CURSOR_FONT_SIZE)
    return <>
        {lines.map((line: Line, key: number) => (
            <line
                key={key}
                {...line2SvgLine(line)}
                stroke={'black'}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
            />
        ))}
        <text {...vectorAdd(point, latLngTextOffset)} fontSize={fontSize}>
            ({fmtLatLng(latLng)})
        </text>
        {CURSOR_SHOW_WIND && vWind && <text {...vectorAdd(point, windTextOffset)} fontSize={fontSize}>
            ({fmtVector(vWind)})
            ({fmtWind(vWind)})
        </text>}
    </>
}

export default MouseCursor
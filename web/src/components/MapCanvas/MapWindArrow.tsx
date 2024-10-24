import { WIND_ARROW_LENGTH, WIND_ARROW_WIDTH } from "@/lib/constants"
import { latLng2canvas, line2SvgLine, screenUnits2canvasUnits } from "@/lib/graph"
import { metersPerSecond2RGBA, rgba2string } from "@/lib/knotsColorScale"
import { makeVector, vectorAdd, vectorScale, unitVector, vectorMagnitude, makeLine, vectorRotate } from "tslib"
import { IApiWind } from "@/types/api"

type MapWindArrowProps = {
    wind: IApiWind
    screen2svgFactor: number
}
const MapWindArrow = (props: MapWindArrowProps) => {
    const {
        wind, screen2svgFactor
    } = props

    const p = latLng2canvas(wind)
    const V = vectorRotate(Math.PI/2)(makeVector(wind.u, wind.v))
    const magnitude = vectorMagnitude(V)
    const color = metersPerSecond2RGBA(magnitude)
    const v = vectorScale(screenUnits2canvasUnits(screen2svgFactor, WIND_ARROW_LENGTH))(unitVector(V))
    const line = makeLine(p, vectorAdd(p, v))

    if (!color) return <></>

    return (<>
        <line
            {...line2SvgLine(line)}
            stroke={rgba2string(color)}
            strokeWidth={WIND_ARROW_WIDTH}
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#windArrow)"
        />
    </>)
}

export default MapWindArrow 
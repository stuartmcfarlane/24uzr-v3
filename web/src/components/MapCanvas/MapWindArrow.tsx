import { WIND_ARROW_LENGTH, WIND_ARROW_WIDTH } from "@/lib/constants"
import { latLng2canvas, line2SvgLine, screenUnits2canvasUnits } from "@/lib/graph"
import { metersPerSecond2RGBA, rgba2string } from "@/lib/knotsColorScale"
import {
    Vector,
    vectorAdd,
    vectorScale,
    unitVector,
    vectorMagnitude,
    makeLine,
    wind2vector,
    fmtUV,
    fmtVector,
    fmtLine,
} from "tslib"
import { IApiWind } from "@/types/api"

type MapWindArrowProps = {
    wind: IApiWind
    screen2svgFactor: number
}
const flipY = ({ x, y }: Vector) => ({x, y: -y})
const MapWindArrow = (props: MapWindArrowProps) => {
    const {
        wind,
        screen2svgFactor,
    } = props

    const p = latLng2canvas(wind)
    const vWind = wind2vector(wind)
    const magnitude = vectorMagnitude(vWind)
    const rgba = metersPerSecond2RGBA(magnitude)
    const color = rgba ? rgba2string(rgba) : 'black'
    const unitV = flipY(vectorScale(screenUnits2canvasUnits(screen2svgFactor, WIND_ARROW_LENGTH))(unitVector(vWind)))
    const line = makeLine(p, vectorAdd(p, unitV))

    return (<>
        <line
            {...line2SvgLine(line)}
            stroke={color}
            strokeWidth={WIND_ARROW_WIDTH}
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#windArrow)"
        />
    </>)
}

export default MapWindArrow 
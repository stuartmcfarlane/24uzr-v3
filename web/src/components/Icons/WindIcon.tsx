import { metersPerSecond2RGBA, rgba2string } from "@/lib/knotsColorScale";
import { fmtReal, Vector, vectorMagnitude, wind2degrees } from "tslib"

type WindIconProps = {
    vWind: Vector
}

const WindIcon = (props: WindIconProps) => {
    const {
        vWind,
    } = props
    const windAngle = wind2degrees(vWind)
    const rgba = metersPerSecond2RGBA(vectorMagnitude(vWind))
    const color = rgba ? rgba2string(rgba) : '#000'
    return (
        <svg
            fill="#000000"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            xmlSpace="preserve"
        >
            <g transform={`rotate(${fmtReal(windAngle, 3)} 16 16)`}>
                <line x1="16" y1="4" x2="16" y2="28" strokeWidth={1} stroke={color} vectorEffect="non-scaling-stroke" />
                <path d="M 16 28 L 12 20 L 20 20 L 16 28 Z" fill={color} strokeWidth={1} stroke={color} vectorEffect="non-scaling-stroke" />
            </g>
        </svg>        
    )
}
export default WindIcon
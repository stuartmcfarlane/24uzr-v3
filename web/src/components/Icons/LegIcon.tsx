import { COLOR_GREEN, COLOR_RED } from "@/lib/constants"
import { IApiBuoyOutput } from "@/types/api"
import { bearingLatLan, fmtReal } from "tslib"

type LegIconProps = {
    startBuoy: IApiBuoyOutput
    endBuoy: IApiBuoyOutput
}

const LegIcon = (props: LegIconProps) => {
    const {
        startBuoy,
        endBuoy,
    } = props
    const bearing = bearingLatLan(startBuoy, endBuoy)
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
            <g transform={`rotate(${fmtReal(bearing, 3)} 16 16)`}>
                <line x1="16" y1="8" x2="16" y2="24" strokeWidth={1} stroke={COLOR_GREEN} vectorEffect="non-scaling-stroke" />
                <circle cx="16" cy="4" r="4" fill={COLOR_RED} strokeWidth={1} stroke={COLOR_RED} />
                <circle cx="16" cy="28" r="4" fill={COLOR_GREEN} strokeWidth={1} stroke={COLOR_GREEN} />
            </g>
        </svg>        
    )
}
export default LegIcon
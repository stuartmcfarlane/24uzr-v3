import { DRAW_LEG_COLOR } from "@/lib/constants"
import { fmtLine, latLng2canvas, line2SvgLine } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput, IApiRouteLegOutput } from "@/types/api"

type MapCreatingLegProps = {
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onSelect?: (leg?: IApiLegOutput) => void
    isSelected?: boolean
}

const MapCreatingLeg = (props: MapCreatingLegProps) => {
    const {
        startBuoy,
        endBuoy,
        onSelect,
        isSelected,
    } = props

    if (!startBuoy || !endBuoy) return <></>

    const start = latLng2canvas(startBuoy)
    const end = latLng2canvas(endBuoy)

    return (
        <line
            {...line2SvgLine([start, end])}
            stroke={DRAW_LEG_COLOR}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#arrow)"
        />
    )
}

export default MapCreatingLeg
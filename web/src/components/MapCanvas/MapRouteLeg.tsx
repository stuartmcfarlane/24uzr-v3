import { ROUTE_LEG_COLOR } from "@/lib/constants"
import { latLng2canvas, line2SvgLine } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput, IApiRouteLegOutput } from "@/types/api"

type MapRouteLegProps = {
    routeLeg: IApiRouteLegOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onSelect?: (leg?: IApiLegOutput) => void
    isSelected?: boolean
    color?: string
}

const MapRouteLeg = (props: MapRouteLegProps) => {
    const {
        routeLeg,
        startBuoy,
        endBuoy,
        onSelect,
        isSelected,
        color,
    } = props

    if (!startBuoy || !endBuoy) return <></>

    const start = latLng2canvas(startBuoy)
    const end = latLng2canvas(endBuoy)

    return (
        <line
            {...line2SvgLine([start, end])}
            stroke={color || ROUTE_LEG_COLOR}
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#arrow)"
        />
    )
}

export default MapRouteLeg
import { MAP_LEG_COLOR } from "@/lib/constants"
import { fmtLine, latLng2canvas, line2SvgLine } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput } from "@/types/api"

type MapLegProps = {
    leg: IApiLegOutput
    returnLeg?: IApiLegOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onSelect?: (leg?: IApiLegOutput) => void
    isSelected?: boolean
}

const MapLeg = (props: MapLegProps) => {
    const {
        leg,
        returnLeg,
        startBuoy,
        endBuoy,
        onSelect,
        isSelected,
    } = props

    if (!startBuoy || !endBuoy) return <></>

    const start = latLng2canvas(startBuoy)
    const end = latLng2canvas(endBuoy)

    return (
        returnLeg
        ? (
            <line
                {...line2SvgLine([start, end])}
                stroke={MAP_LEG_COLOR}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
            />
        )
        : (
            <line
                {...line2SvgLine([start, end])}
                stroke={MAP_LEG_COLOR}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                markerEnd="url(#arrow)"
            />
        )
    )
}

export default MapLeg
import { fmtLine, latLng2canvas, line2SvgLine } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput } from "@/types/api"

type MapLegProps = {
    leg: IApiLegOutput
    returnLeg: IApiLegOutput
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
                stroke={'green'}
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
                marker-end="url(#arrow)"
                marker-start="url(#arrow)"
            />
        )
        : (
            <line
                {...line2SvgLine([start, end])}
                stroke={'green'}
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
                marker-end="url(#arrow)"
            />
        )
    )
}

export default MapLeg
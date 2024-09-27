import { fmtLine, latLng2canvas, line2SvgLine } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput, IApiRouteLegOutput } from "@/types/api"

type MapRouteLegProps = {
    routeLeg: IApiRouteLegOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onSelect?: (leg?: IApiLegOutput) => void
    isSelected?: boolean
}

const MapRouteLeg = (props: MapRouteLegProps) => {
    const {
        routeLeg,
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
            stroke={'blue'}
            strokeWidth={3}
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#arrow)"
        />
    )
}

export default MapRouteLeg
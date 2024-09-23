import { fmtLine, latLng2canvas, line2SvgLine } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput } from "@/types/api"

type MapLegProps = {
    leg: IApiLegOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onSelect?: (leg?: IApiLegOutput) => void
    isSelected?: boolean
}

const MapLeg = (props: MapLegProps) => {
    const {
        leg,
        startBuoy,
        endBuoy,
        onSelect,
        isSelected,
    } = props

    if (!startBuoy || !endBuoy) return <></>

    const start = latLng2canvas(startBuoy)
    const end = latLng2canvas(endBuoy)

    return <>
        <line
            {...line2SvgLine([start, end])}
            stroke={isSelected ? 'red' : 'green'}
            strokeWidth={5}
            vectorEffect="non-scaling-stroke"
        />
    </>
}

export default MapLeg
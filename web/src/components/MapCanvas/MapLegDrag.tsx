import { fmtLine, line2SvgLine } from "@/lib/graph"
import { IApiBuoyOutput } from "@/types/api"

type MapLegDragProps = {
    start?: Point
    end?: Point
    startBuoy: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
}

const MapLegDrag = (props: MapLegDragProps) => {
    const {
        start,
        end,
        startBuoy,
        endBuoy
    } = props

    if (!start || !end) return <></>

    return <>
        <line
            {...line2SvgLine([start, end])}
            stroke={'rgb(14 165 233)'}
            strokeWidth={endBuoy ? 5 : 2}
            vectorEffect="non-scaling-stroke"
        />
    </>
}

export default MapLegDrag
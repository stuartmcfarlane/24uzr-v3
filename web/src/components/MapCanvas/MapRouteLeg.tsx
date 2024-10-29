import { ROUTE_LEG_COLOR } from "@/lib/constants"
import { latLng2canvas, line2SvgLine, line2SvgPath, screenUnits2canvasUnits } from "@/lib/graph"
import { IApiBuoyOutput, IApiRouteLegOutput } from "@/types/api"
import { useState } from "react"

type MapRouteLegProps = {
    routeLeg: IApiRouteLegOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onSelect?: (leg?: IApiRouteLegOutput) => void
    isSelected?: boolean
    isHovered?: boolean
    color?: string
    onHover?: (routeLeg?: IApiRouteLegOutput) => void
    screen2svgFactor?: number
}

const MapRouteLeg = (props: MapRouteLegProps) => {
    const {
        routeLeg,
        startBuoy,
        endBuoy,
        onSelect,
        isSelected,
        isHovered,
        color,
        onHover,
        screen2svgFactor,
    } = props

    const [hover, setHover] = useState(false)
    const onClick = () => onSelect && onSelect(routeLeg)
    const onMouseEnter = () => {
        onHover && onHover(routeLeg)
        setHover(() => true)
    }
    const onMouseLeave = () => {
        onHover && onHover()
        setHover(() => false)
    }

    if (!startBuoy || !endBuoy) return <></>

    const start = latLng2canvas(startBuoy)
    const end = latLng2canvas(endBuoy)

    const hoverWidth = screenUnits2canvasUnits(screen2svgFactor, 1)


    return (<>
        <line
            {...line2SvgLine([start, end])}
            stroke={color || ROUTE_LEG_COLOR}
            strokeWidth={hover || isSelected || isHovered ? 2 : 1}
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#arrow)"
        />
        <path
            {...line2SvgPath([start, end], hoverWidth)}
            stroke="transparent"
            fill="transparent"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    </>)
}

export default MapRouteLeg
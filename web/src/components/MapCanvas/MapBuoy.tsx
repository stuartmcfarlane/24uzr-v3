"use client"

import { latLng2canvas, screenUnits2canvasUnits } from "@/lib/graph"
import { IApiBuoyOutput } from "@/types/api"
import { MouseEvent, useRef, useState } from "react"

type MapBuoyProps = {
    buoy: IApiBuoyOutput
    onSelect?: (buoy: IApiBuoyOutput) => void
    screen2svgFactor?: number
}

const MapBuoy = (props: MapBuoyProps & ScaleToViewBoxProps) => {
    const {
        buoy,
        onSelect,
        screen2svgFactor,
    } = props
    const { x, y } = latLng2canvas(buoy)

    const hoverRef = useRef<SVGCircleElement>(null)

    const [hover, setHover] = useState<boolean>(false)

    const clickRadius = 15
    const radius = 5
    const onClick = () => onSelect && onSelect(buoy)
    const onMouseEnter = () => setHover(() => true)
    const onMouseLeave = () => setHover(() => false)
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={screenUnits2canvasUnits(screen2svgFactor, radius)}
                fill={'yellow'}
                stroke={'black'}
                strokeWidth={hover ? 2 : 1}
                vectorEffect="non-scaling-stroke"
            />
            <text x={x+10} y={y+10}>{buoy.name}</text>
            <circle
                ref={hoverRef}
                cx={x}
                cy={y}
                r={screenUnits2canvasUnits(screen2svgFactor, clickRadius)}
                fill={'transparent'}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        </>
    )
}

export default MapBuoy
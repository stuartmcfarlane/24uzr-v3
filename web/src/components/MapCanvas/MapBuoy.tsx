"use client"

import { curry } from "@/lib/fp"
import { latLng2canvas, makePoint, screenUnits2canvasUnits } from "@/lib/graph"
import { vectorAdd } from "@/lib/vector"
import { IApiBuoyOutput } from "@/types/api"
import { MouseEvent, useCallback, useRef, useState } from "react"

type MapBuoyProps = {
    buoy: IApiBuoyOutput
    onSelect?: (buoy: IApiBuoyOutput) => void
    screen2svgFactor?: number
}

const CLICK_RADIUS = 15
const RADIUS = 5
const TEXT_OFFSET = makePoint(10, 10)
const FONT_SIZE = 20

const MapBuoy = (props: MapBuoyProps & ScaleToViewBoxProps) => {
    const {
        buoy,
        onSelect,
        screen2svgFactor,
    } = props
    const { x, y } = latLng2canvas(buoy)

    const hoverRef = useRef<SVGCircleElement>(null)

    const [hover, setHover] = useState<boolean>(false)

    const clickRadius = screenUnits2canvasUnits(screen2svgFactor, CLICK_RADIUS)
    const radius = screenUnits2canvasUnits(screen2svgFactor, RADIUS)
    const textOffset = makePoint(screenUnits2canvasUnits(
        screen2svgFactor, TEXT_OFFSET.x),
        screenUnits2canvasUnits(screen2svgFactor, TEXT_OFFSET.y)
    )
    const fontSize = screenUnits2canvasUnits(screen2svgFactor, FONT_SIZE)

    const onClick = () => onSelect && onSelect(buoy)
    const onMouseEnter = () => setHover(() => true)
    const onMouseLeave = () => setHover(() => false)
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={radius}
                fill={'yellow'}
                stroke={'black'}
                strokeWidth={hover ? 2 : 1}
                vectorEffect="non-scaling-stroke"
            />
            <text {...vectorAdd({x, y}, textOffset)} fontSize={fontSize}>{buoy.name}</text>
            <circle
                ref={hoverRef}
                cx={x}
                cy={y}
                r={clickRadius}
                fill={'transparent'}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        </>
    )
}

export default MapBuoy
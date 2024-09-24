"use client"

import { BUOY_CLICK_RADIUS, BUOY_FONT_SIZE, BUOY_RADIUS, BUOY_TEXT_OFFSET } from "@/lib/constants"
import { latLng2canvas, makePoint, screenUnits2canvasUnits } from "@/lib/graph"
import { vectorAdd } from "@/lib/vector"
import { IApiBuoyOutput } from "@/types/api"
import { useRef, useState } from "react"

type MapBuoyProps = {
    buoy: IApiBuoyOutput
    onSelect?: (buoy: IApiBuoyOutput) => void
    onHover?: (buoy?: IApiBuoyOutput) => void
    screen2svgFactor?: number
    isSelected?: boolean
}

const MapBuoy = (props: MapBuoyProps & ScaleToViewBoxProps) => {
    const {
        buoy,
        onSelect,
        onHover,
        screen2svgFactor,
        isSelected,
    } = props
    const { x, y } = latLng2canvas(buoy)

    const hoverRef = useRef<SVGCircleElement>(null)

    const [hover, setHover] = useState<boolean>(false)

    const clickRadius = screenUnits2canvasUnits(screen2svgFactor, BUOY_CLICK_RADIUS)
    const radius = screenUnits2canvasUnits(screen2svgFactor, BUOY_RADIUS)
    const textOffset = makePoint(screenUnits2canvasUnits(
        screen2svgFactor, BUOY_TEXT_OFFSET.x),
        screenUnits2canvasUnits(screen2svgFactor, BUOY_TEXT_OFFSET.y)
    )
    const fontSize = screenUnits2canvasUnits(screen2svgFactor, BUOY_FONT_SIZE)

    const onClick = () => onSelect && onSelect(buoy)
    const onMouseEnter = () => {
        onHover && onHover(buoy)
        setHover(() => true)
    }
    const onMouseLeave = () => {
        onHover && onHover()
        setHover(() => false)
    }

    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={radius}
                fill={isSelected ? 'red' : 'yellow'}
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
                data-drag-target-type={'buoy'}
                data-drag-target={JSON.stringify(buoy)}
            />
        </>
    )
}

export default MapBuoy
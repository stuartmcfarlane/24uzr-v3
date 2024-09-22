"use client"

import { domRect2rect, fitToClient, fmtReal, fmtRect, growRect, latLng2canvas, makeScreen2svgFactor, points2boundingRect, rect2viewBox, rectAspectRatio, screenUnits2canvasUnits } from "@/lib/graph"
import { IApiBuoyOutput } from "@/types/api"
import MapBuoy from "./MapBuoy"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { rect2SvgRect } from '../../lib/graph';
import useClientDimensions from "@/hooks/useClientDimensions"
import { useDebouncedCallback } from "use-debounce"
import { realEq } from "@/lib/math"

const DEBUG = false

const MIN_MARGIN = 50

type MapSvgProps = {
    buoys: IApiBuoyOutput[]
    selectedBuoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
}

const MapSvg = (props: MapSvgProps) => {
    const {
        buoys,
        onSelectBuoy,
        selectedBuoy,
    } = props

    const innerBoundingRect = points2boundingRect(
        buoys.map(latLng2canvas)
    )
    
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    
    const [viewBoxRect, setViewBoxRect] = useState<Rect | undefined>()
    const [boundingRect, setBoundingRect] = useState<Rect | undefined>()
    const [clientRect, setClientRect] = useState<Rect | undefined>()
    const [screen2svgFactor, setScreen2svgFactor] = useState<number>(1)

    const clientDimensions = useClientDimensions(containerRef)

    useEffect(
        useDebouncedCallback(() => {
            const boundingRect = growRect(
                `10%,${screenUnits2canvasUnits(screen2svgFactor, MIN_MARGIN)}`,
                points2boundingRect(
                    buoys.map(latLng2canvas)
                )
            )
            setBoundingRect(boundingRect)
        }, 50),
        [ buoys, screen2svgFactor ]
    )
    useEffect(
        () => {
            if (!svgRef.current) return
            const clientRect = domRect2rect(svgRef.current?.getBoundingClientRect())
            setClientRect(clientRect)
        },
        [ clientDimensions.width, clientDimensions.height ]
    )
    useEffect(
        () => {
            if (!svgRef.current) return
            if (!boundingRect) return
            const viewBoxRect = fitToClient(boundingRect, clientRect)
            setViewBoxRect(viewBoxRect)
        },
        [ boundingRect, clientRect ]
    )
    useEffect(
        () => {
            if (!viewBoxRect || !clientRect) return
            const newFactor = makeScreen2svgFactor(viewBoxRect, clientRect)
            // when the factor is small is can converge slowly so we stop when the delta is small
            if (realEq(0.1)(newFactor, screen2svgFactor)) return
            setScreen2svgFactor(newFactor)
        },
        [ viewBoxRect, clientRect ]
    )
    const onClick = (e: MouseEvent<SVGSVGElement>) => {
        if (e.target === svgRef?.current) onSelectBuoy && onSelectBuoy()
    }
    return (
        <div ref={containerRef} className="w-full h-full relative" >
            <svg
                ref={svgRef}
                width={clientDimensions.width}
                height={clientDimensions.height}
                {...rect2viewBox(viewBoxRect)}
                className="absolute"
                onClick={onClick}
            >
                {DEBUG && boundingRect && <rect {...rect2SvgRect(boundingRect)}
                    stroke={'black'}
                    strokeWidth={1}
                    fill={'transparent'}
                    vectorEffect="non-scaling-stroke"
                />}
                {DEBUG && innerBoundingRect && <rect {...rect2SvgRect(innerBoundingRect)}
                    stroke={'green'}
                    strokeWidth={1}
                    fill={'transparent'}
                    vectorEffect="non-scaling-stroke"
                />}
                {DEBUG && viewBoxRect && <rect {...rect2SvgRect(viewBoxRect)}
                    stroke={'blue'}
                    strokeWidth={1}
                    fill={'transparent'}
                    vectorEffect="non-scaling-stroke"
                />}
                {(buoys || []).map(buoy => (
                    <MapBuoy key={buoy.id}
                        buoy={buoy}
                        screen2svgFactor={screen2svgFactor}
                        viewBoxRect={boundingRect}
                        onSelect={onSelectBuoy}
                        isSelected={buoy.id === selectedBuoy?.id}
                    />)
                )}
            </svg>
        </div>
    )
}

export default MapSvg
"use client"

import { domRect2rect, fitToClient, fmtReal, fmtRect, growRect, latLng2canvas, makeScreen2svgFactor, points2boundingRect, rect2viewBox, rectAspectRatio } from "@/lib/graph"
import { IApiBuoyOutput } from "@/types/api"
import MapBuoy from "./MapBuoy"
import { useEffect, useRef, useState } from "react"
import { rect2SvgRect } from '../../lib/graph';
import useClientDimensions from "@/hooks/useClientDimensions"

const DEBUG = false

type MapSvgProps = {
    buoys: IApiBuoyOutput[]
    onSelectBuoy?: (buoy: IApiBuoyOutput) => void
}

const MapSvg = (props: MapSvgProps) => {
    const {
        buoys,
        onSelectBuoy,
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
        () => {
            const boundingRect = growRect(
                "10%,10",
                points2boundingRect(
                    buoys.map(latLng2canvas)
                )
            )
            setBoundingRect(boundingRect)
        },
        [ buoys ]
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
            const screen2svgFactor = makeScreen2svgFactor(viewBoxRect, clientRect)
            setScreen2svgFactor(screen2svgFactor)
        },
        [ viewBoxRect, clientRect ]
    )
    return (
        <div ref={containerRef} className="w-full h-full relative" >
            <svg
                ref={svgRef}
                width={clientDimensions.width}
                height={clientDimensions.height}
                {...rect2viewBox(viewBoxRect)}
                className="absolute"
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
                    />)
                )}
            </svg>
        </div>
    )
}

export default MapSvg
"use client"

import { domRect2rect, fitToClient, fmtReal, fmtRect, growRect, latLng2canvas, points2boundingRect, rect2viewBox, rectAspectRatio } from "@/lib/graph"
import { IApiBuoyOutput } from "@/types/api"
import MapBuoy from "./MapBuoy"
import { useEffect, useRef, useState } from "react"
import { rect2SvgRect } from '../../lib/graph';
import useClientDimensions from "@/hooks/useClientDimensions"

type MapSvgProps = {
    buoys: IApiBuoyOutput[]
}

const MapSvg = (props: MapSvgProps) => {
    const { buoys } = props
    const innerBoundingRect = points2boundingRect(
        buoys.map(latLng2canvas)
    )
    
    const svgRef = useRef<SVGSVGElement>(null)
    
    const [fitRect, setFitRect] = useState<Rect | undefined>()
    const [boundingRect, setBoundingRect] = useState<Rect | undefined>()

    const clientDimensions = useClientDimensions

    useEffect(
        () => {
            const boundingRect = growRect(
                "10%",
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
            if (!boundingRect) return
            const clientRect = domRect2rect(svgRef.current?.getBoundingClientRect())
            const fitRect = fitToClient(boundingRect, clientRect)
            setFitRect(fitRect)
        },
        [ boundingRect, clientDimensions ]
    )
    return (
        <svg ref={svgRef} className="w-full h-full" {...rect2viewBox(fitRect)}>
            {boundingRect && <rect {...rect2SvgRect(boundingRect)}
                stroke={'black'}
                strokeWidth={1}
                fill={'transparent'}
                vectorEffect="non-scaling-stroke"
            />}
            <rect {...rect2SvgRect(innerBoundingRect)}
                stroke={'green'}
                strokeWidth={1}
                fill={'transparent'}
                vectorEffect="non-scaling-stroke"
            />
            {fitRect && <rect {...rect2SvgRect(fitRect)}
                stroke={'blue'}
                strokeWidth={1}
                fill={'transparent'}
                vectorEffect="non-scaling-stroke"
            />}
            {(buoys || []).map(buoy => <MapBuoy key={buoy.id} buoy={buoy} viewBoxRect={boundingRect} />)}
        </svg>
    )
}

export default MapSvg
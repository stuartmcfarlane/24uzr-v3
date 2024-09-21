"use client"

import { domRect2rect, fitToClient, fmtReal, fmtRect, growRect, latLng2canvas, points2boundingRect, rect2viewBox, rectAspectRatio } from "@/lib/graph"
import { IApiBuoyOutput } from "@/types/api"
import MapBuoy from "./MapBuoy"
import { useEffect, useRef, useState } from "react"
import { rect2SvgRect } from '../../lib/graph';

type MapSvgProps = {
    buoys: IApiBuoyOutput[]
}

const MapSvg = (props: MapSvgProps) => {
    const { buoys } = props
    const innerBoundingRect = points2boundingRect(
        buoys.map(latLng2canvas)
    )
    const boundingRect = growRect(
        "10%",
        points2boundingRect(
            buoys.map(latLng2canvas)
        )
    )
    
    const svgRef = useRef<SVGSVGElement>(null)
    
    const [fitRect, setFitRect] = useState<Rect|undefined>()
    useEffect(
        () => {
            if (!svgRef.current) return
            console.log(`client rect`, svgRef.current.getBoundingClientRect())
            const clientRect = domRect2rect(svgRef.current?.getBoundingClientRect())
            const fitRect = fitToClient(boundingRect, clientRect)
            setFitRect(fitRect)
            console.log(`viewbox`, {
                client: `α ${fmtReal(rectAspectRatio(clientRect))}${fmtRect(clientRect)}`,
                bounding: `α ${fmtReal(rectAspectRatio(boundingRect))}${fmtRect(boundingRect)}`,
                fit: `α ${fmtReal(rectAspectRatio(fitRect))}${fmtRect(fitRect)}`,
            })
        },
        []
    )
    return (
        <svg ref={svgRef} className="w-full h-full" viewBox={rect2viewBox(fitRect)}>
            <rect {...rect2SvgRect(boundingRect)}
                stroke={'black'}
                strokeWidth={1}
                fill={'transparent'}
                vectorEffect="non-scaling-stroke"
            />
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
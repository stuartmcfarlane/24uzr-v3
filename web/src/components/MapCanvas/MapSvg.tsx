"use client"

import { clientPoint2svgPoint, domRect2rect, fitToClient, rectGrowMargin, latLng2canvas, makePoint, makeRect, makeScreen2svgFactor, points2boundingRect, rect2viewBox, screenUnits2canvasUnits, fmtRect, fmtReal } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput } from "@/types/api"
import MapBuoy from "./MapBuoy"
import { act, MouseEvent, useEffect, useRef, useState } from "react"
import { rect2SvgRect } from '../../lib/graph';
import useClientDimensions from "@/hooks/useClientDimensions"
import { useDebouncedCallback } from "use-debounce"
import { realEq } from "@/lib/math"
import { vectorAdd } from '../../lib/vector';
import { useMouseDrag } from "@/hooks/useMouseDrag"
import { useMouseSvgPosition } from "@/hooks/useMousePosition"
import { useChange } from "@/hooks/useChange"
import MapLegDrag from "./MapLegDrag"
import MapLeg from "./MapLeg"
import { idIs } from "@/lib/fp"
import { actualLegs } from "@/lib/legs"
import { MAX_MARGIN, MIN_MARGIN } from "@/lib/constants"
import { useScrollWheelZoom } from "@/hooks/useScrollWheelZoom"
import MouseCursor from "./MouseCursor"

const DEBUG = false

type MapSvgProps = {
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
    selectedBuoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    selectedLeg?: IApiLegOutput
    onSelectLeg?: (buoy?: IApiLegOutput) => void
    onCreateLeg?: (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => void
}

const MapSvg = (props: MapSvgProps) => {
    const {
        buoys,
        legs,
        onSelectBuoy,
        selectedBuoy,
        onSelectLeg,
        selectedLeg,
        onCreateLeg,
    } = props

    const innerBoundingRect = points2boundingRect(
        buoys.map(latLng2canvas)
    )
    
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const unitRef = useRef<SVGRectElement>(null)
    
    const [viewBoxRect, setViewBoxRect] = useState<Rect | undefined>()
    const [actualViewBoxRect, setActualViewBoxRect] = useState<Rect | undefined>()
    const [maxBoundingViewBoxRect, setMaxBoundingViewBoxRect] = useState<Rect | undefined>()
    const [initialBoundingViewBoxRect, setInitialBoundingViewBoxRect] = useState<Rect | undefined>()
    const [boundingRect, setBoundingRect] = useState<Rect | undefined>()
    const [clientRect, setClientRect] = useState<Rect | undefined>()
    const [screen2svgFactor, setScreen2svgFactor] = useState<number>(1)
    const [draggedBuoy, setDraggedBuoy] = useState<IApiBuoyOutput|undefined>()
    const [hoveredBuoy, setHoveredBuoy] = useState<IApiBuoyOutput|undefined>()

    const clientDimensions = useClientDimensions(containerRef)

    const onHoverBuoy = (buoy?: IApiBuoyOutput) => {
        setHoveredBuoy(buoy)
    }
    const mouseDragBuoy = useMouseDrag(svgRef, [
        (element: HTMLElement | SVGElement, mousePosition: Point) => {
            const dragTargetType = element?.dataset['dragTargetType']
            if (dragTargetType === 'buoy') {
                const buoy = element.dataset.dragTarget && JSON.parse(element.dataset.dragTarget)
                setDraggedBuoy(buoy)
                return true
            }
            return false
        }
    ])
    useChange(
        () => {
            if (!mouseDragBuoy.dragging) {
                if (draggedBuoy && hoveredBuoy && draggedBuoy.id !== hoveredBuoy.id) {
                    onCreateLeg && onCreateLeg(draggedBuoy, hoveredBuoy)
                }
            }
        },
        [ mouseDragBuoy.dragging ]
    )

    useEffect(
        () => {
            const boundingRect = rectGrowMargin(
                `10%`,
                points2boundingRect(
                    buoys.map(latLng2canvas)
                )
            )
            setBoundingRect(boundingRect)
            setInitialBoundingViewBoxRect(boundingRect)
        },
        [ buoys ]
    )
    useEffect(
        () => {
            if (!boundingRect) return
            const maxBoundingRect = rectGrowMargin(
                `10%`,
                boundingRect
            )
            console.log(`setMaxBoundingViewBoxRect( ${fmtRect(maxBoundingRect)} )`)
            setMaxBoundingViewBoxRect(maxBoundingRect)
        },
        [ boundingRect ]
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
            console.log(`setViewBoxRect(${fmtRect(initialBoundingViewBoxRect)})`)
            setViewBoxRect(initialBoundingViewBoxRect)
        },
        [initialBoundingViewBoxRect]
    )

    const zoomedViewBoxRect = useScrollWheelZoom(svgRef, initialBoundingViewBoxRect, maxBoundingViewBoxRect)

    useEffect(
        () => {
            const actual = zoomedViewBoxRect || viewBoxRect
            if (!actual || !clientRect) return
            setActualViewBoxRect(fitToClient(actual, clientRect))
        },
        [ boundingRect, clientRect, viewBoxRect, zoomedViewBoxRect ]
    )
    useEffect(
        () => {
            const newFactor = makeScreen2svgFactor(svgRef)
            setScreen2svgFactor(newFactor)
        },
        [ actualViewBoxRect ]
    )

    const onClick = (e: MouseEvent<SVGSVGElement>) => {
        if (e.target === svgRef?.current) onSelectBuoy && onSelectBuoy()
    }
    const mouseSvgPoint = useMouseSvgPosition(svgRef)

    return (
        <div ref={containerRef} className="w-full h-full relative" >
            <svg
                ref={svgRef}
                width={clientDimensions.width}
                height={clientDimensions.height}
                {...rect2viewBox(actualViewBoxRect)}
                className="map-canvas absolute"
                onClick={onClick}
            >
                <defs>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="10"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z"
                            fill="context-stroke"
                        />
                    </marker>
                </defs>
                {mouseSvgPoint && (
                    <MouseCursor
                        point={mouseSvgPoint}
                        screen2svgFactor={screen2svgFactor}
                    />
                )}
                {(actualLegs(legs)).map(([leg, returnLeg]) => (
                    <MapLeg key={leg.id}
                        leg={leg}
                        returnLeg={returnLeg}
                        startBuoy={buoys.find(idIs(leg.startBuoyId))}
                        endBuoy={buoys.find(idIs(leg.endBuoyId))}
                        onSelect={onSelectLeg}
                        isSelected={leg.id === selectedLeg?.id}
                    />)
                )}
                {mouseDragBuoy.dragging
                    && mouseDragBuoy.mousePosition.end
                    && draggedBuoy
                    && (
                    <MapLegDrag
                        start={latLng2canvas(draggedBuoy)}
                        end={clientPoint2svgPoint(svgRef.current, mouseDragBuoy.mousePosition.end)}
                        startBuoy={draggedBuoy}
                        endBuoy={hoveredBuoy}
                    />
                )}
                {(buoys || []).map(buoy => (
                    <MapBuoy key={buoy.id}
                        buoy={buoy}
                        screen2svgFactor={screen2svgFactor}
                        viewBoxRect={boundingRect}
                        onSelect={onSelectBuoy}
                        onHover={onHoverBuoy}
                        isSelected={buoy.id === selectedBuoy?.id}
                    />)
                )}
                {DEBUG && viewBoxRect && <>
                    <rect ref={unitRef}
                        {...rect2SvgRect(
                            makeRect(
                                viewBoxRect[0].x, viewBoxRect[0].y,
                                screenUnits2canvasUnits(screen2svgFactor, 100),
                                screenUnits2canvasUnits(screen2svgFactor, 100)
                            )
                        )}
                        stroke={'pink'}
                        strokeWidth={1}
                        fill={'transparent'}
                        vectorEffect="non-scaling-stroke"
                    />
                    <text
                        {...vectorAdd(
                            makePoint(0, screenUnits2canvasUnits(screen2svgFactor, 10)),
                            viewBoxRect[0]
                        )}
                        fontSize={screenUnits2canvasUnits(screen2svgFactor, 10)}
                    >
                        {unitRef?.current?.getBoundingClientRect().width}
                    </text>
                </>}
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
            </svg>
        </div>
    )
}

export default MapSvg
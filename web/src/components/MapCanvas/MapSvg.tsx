"use client"

import { clientPoint2svgPoint, domRect2rect, fitToClient, rectGrowMargin, latLng2canvas, makePoint, makeRect, makeScreen2svgFactor, points2boundingRect, rect2viewBox, screenUnits2canvasUnits, fmtRect } from "@/lib/graph"
import { IApiBuoyOutput, IApiLegOutput } from "@/types/api"
import MapBuoy from "./MapBuoy"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { rect2SvgRect } from '../../lib/graph';
import useClientDimensions from "@/hooks/useClientDimensions"
import { useDebouncedCallback } from "use-debounce"
import { realEq } from "@/lib/math"
import { vectorAdd } from '../../lib/vector';
import { MousePosition, useMouseDrag } from "@/hooks/useMouseDrag"
import { useMousePosition } from "@/hooks/useMousePosition"
import { useChange } from "@/hooks/useChange"
import MapLegDrag from "./MapLegDrag"
import { apiCreateLeg } from "@/services/api"
import MapLeg from "./MapLeg"
import { and, idIs, idIsNot } from "@/lib/fp"
import { actualLegs } from "@/lib/legs"
import { MAX_MARGIN, MIN_MARGIN } from "@/lib/constants"
import { useScrollWheelZoom } from "@/hooks/useScrollWheelZoom"

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
        useDebouncedCallback(() => {
            const boundingRect = rectGrowMargin(
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
            if (!boundingRect) return
            const maxBoundingRect = rectGrowMargin(
                `50%,${screenUnits2canvasUnits(screen2svgFactor, MAX_MARGIN)}`,
                boundingRect
            )
            console.log(`setMaxBoundingViewBoxRect( ${fmtRect(maxBoundingRect)} )`)
            setMaxBoundingViewBoxRect(maxBoundingRect)
        },
        [ boundingRect, screen2svgFactor ]
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
            console.log(`setInitialBoundingViewBoxRect( ${fmtRect(viewBoxRect)} )`)
            setInitialBoundingViewBoxRect(viewBoxRect)
        },
        [ boundingRect, clientRect ]
    )
    useEffect(
        () => {
            console.log(`!!initialBoundingViewBoxRect => setViewBoxRect(${fmtRect(initialBoundingViewBoxRect)})`)
            setViewBoxRect(initialBoundingViewBoxRect)
        },
        [initialBoundingViewBoxRect]
    )
    useEffect(
        () => {
            if (!viewBoxRect || !clientRect) return
            const newFactor = makeScreen2svgFactor(viewBoxRect, clientRect)
            // when the factor is small is can converge slowly so we stop when the delta is small
            setScreen2svgFactor((screen2svgFactor) => {
                if (realEq(0.001)(newFactor, screen2svgFactor)) {
                    return screen2svgFactor
                }
                return newFactor
            })
        },
        [ viewBoxRect, clientRect ]
    )

    const zoomedViewBoxRect = useScrollWheelZoom(svgRef, initialBoundingViewBoxRect, maxBoundingViewBoxRect)

    useChange(
        () => {
            if (!zoomedViewBoxRect) return
            console.log(`!!zoomedViewBoxRect => setViewBoxRect(${fmtRect(zoomedViewBoxRect)})`)
            setViewBoxRect(zoomedViewBoxRect)
        },
        [zoomedViewBoxRect]
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
"use client"

import {
    clientPoint2svgPoint,
    domRect2rect,
    latLng2canvas,
    makeScreen2svgFactor,
    screenUnits2canvasUnits,
    canvas2latLng,    
} from "@/lib/graph"
import {
    fitToClient,
    rectGrowMargin,
    makePoint,
    makeRect,
    points2boundingRect,
    rect2viewBox,
    makeRectSafe,
    pointInRect,
    LatLng,
    Rect,
    Point
} from 'tslib'
import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiRouteLegOutput, IApiShipOutput, Region } from "@/types/api"
import MapBuoy from "./MapBuoy"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { rect2SvgRect } from '../../lib/graph';
import useClientDimensions from "@/hooks/useClientDimensions"
import { vectorAdd } from 'tslib';
import { useMouseDrag } from "@/hooks/useMouseDrag"
import { useMouseSvgPosition } from "@/hooks/useMousePosition"
import { useChange } from "@/hooks/useChange"
import MapLegDrag from "./MapLegDrag"
import MapLeg from "./MapLeg"
import { idIs } from "tslib"
import { actualLegs } from "@/lib/legs"
import { useScrollWheelZoom } from "@/hooks/useScrollWheelZoom"
import MouseCursor from "./MouseCursor"
import ArrowMarker from "./ArrowMarker"
import MapRouteLeg from "./MapRouteLeg"
import MapCreatingLeg from "./MapCreatingLeg"
import { COLOR_BLUE, ROUTE_LEG_COLOR, ROUTE_LEG_HOVER_COLOR } from "@/lib/constants"
import MapWind from "./MapWind"
import MapGeometry from "./MapGeometry"
import MouseRegion from "./MouseRegion"
import MapRegion from "./MapRegion"
import MapRoute from "./MapRoute"

const DEBUG = false

type MapSvgProps = {
    initialBoundingRect?: Rect
    map?: IApiMapOutput
    wind?: IApiBulkWind[]
    buoys?: IApiBuoyOutput[]
    legs?: IApiLegOutput[]
    routeLegs?: IApiRouteLegOutput[]
    hoverRouteLegs?: IApiRouteLegOutput[]
    geometry: IApiGeometryOutput[]
    ship?: IApiShipOutput
    selectedBuoy?: IApiBuoyOutput
    onClearSelections?: () => void
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    selectedLeg?: IApiLegOutput
    onSelectLeg?: (buoy?: IApiLegOutput) => void
    onCreateLeg?: (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => void
    creatingLeg?: { startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput }
    showWind?: boolean
    windTime?: number
    onMousePosition?: (latLng: LatLng) => void
    onMouseDragPosition?: (point?: LatLng, mark?: LatLng) => void
    selectedMapRegion?: Region
}

const MapSvg = (props: MapSvgProps) => {
    const {
        initialBoundingRect,
        map,
        wind,
        buoys,
        legs,
        routeLegs,
        hoverRouteLegs,
        geometry,
        ship,
        onClearSelections,
        onSelectBuoy,
        selectedBuoy,
        onSelectLeg,
        selectedLeg,
        onCreateLeg,
        creatingLeg,
        showWind,
        windTime,
        onMousePosition,
        onMouseDragPosition,
        selectedMapRegion,
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const clickCatcherRef = useRef<SVGRectElement>(null)
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
    const isDragTarget = (type: string) => (element: HTMLElement | SVGElement) => {
        const dragTargetType = element?.dataset['dragTargetType']
        return (dragTargetType === type)
    }
    const mouseDragBuoy = useMouseDrag(svgRef, [
        (element: HTMLElement | SVGElement, mousePosition: Point) => {
            if (isDragTarget('buoy')(element)) {
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
    const mouseDragRegion = useMouseDrag(svgRef, [
        (element: HTMLElement | SVGElement, mousePosition: Point) => {
            if (isDragTarget('region')(element)) {
                return true
            }
            return false
        }
    ])
    useChange(
        () => {
            if (!mouseDragRegion.mousePosition.start) return
            const canvasPoint = clientPoint2svgPoint(svgRef.current, mouseDragRegion.mousePosition.start)
            if (!canvasPoint) return
            const latLng = canvas2latLng(canvasPoint)
            onMousePosition && onMousePosition(latLng)
        },
        [mouseDragRegion.mousePosition.start?.x, mouseDragRegion.mousePosition.start?.y]
    )

    useChange(
        () => {
            if (!mouseDragRegion.dragging || !mouseDragRegion.mousePosition.start) {
                onMouseDragPosition && onMouseDragPosition(undefined, undefined)
                return
            }
            const start = clientPoint2svgPoint(svgRef.current, mouseDragRegion.mousePosition.start)
            const end = clientPoint2svgPoint(svgRef.current, mouseDragRegion.mousePosition.end)
            if (!start || !end) {
                onMouseDragPosition && onMouseDragPosition(undefined, undefined)
                return
            }
            const point = canvas2latLng(start)
            const mark = canvas2latLng(end)
            onMouseDragPosition && onMouseDragPosition(point, mark)
        },
        [mouseDragRegion.dragging && mouseDragRegion.mousePosition.end?.x, mouseDragRegion.mousePosition.end?.y]
    )


    useEffect(
        () => {
            if (initialBoundingRect) {
                const boundingRect = rectGrowMargin(
                    `10%`,
                    initialBoundingRect
               )
                setInitialBoundingViewBoxRect(boundingRect)
            }
            if (map && (map.lat1 || map.lat2 || map.lng1 || map.lng2)) {
                const p1 = latLng2canvas({ lng: map.lng1, lat: map.lat1})
                const p2 = latLng2canvas({ lng: map.lng2, lat: map.lat2 })
                const boundingRect = makeRectSafe(p1, p2)
                setBoundingRect(boundingRect)
                if (!initialBoundingRect) setInitialBoundingViewBoxRect(boundingRect)
                return
            }

            if (!buoys?.length) {
                setBoundingRect(makeRect(0, 0, 100, 100))
                setInitialBoundingViewBoxRect(makeRect(0, 0, 100, 100))
                return
            }
            const boundingRect = rectGrowMargin(
                `10%`,
                points2boundingRect(
                    buoys.map(latLng2canvas)
                )
            )
            setBoundingRect(boundingRect)
            setInitialBoundingViewBoxRect(boundingRect)
        },
        [ buoys, map, initialBoundingRect ]
    )
    useEffect(
        () => {
            if (!boundingRect) return
            const maxBoundingRect = rectGrowMargin(
                `10%`,
                boundingRect
            )
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

    const onClick = (e: MouseEvent<SVGRectElement>) => {
        if (e.target === clickCatcherRef.current) {
            onClearSelections && onClearSelections()
        }
    }
    const mouseSvgPoint = useMouseSvgPosition(svgRef)

    useChange(
        () => {
            if (!mouseSvgPoint) return
            if (!pointInRect(actualViewBoxRect)(mouseSvgPoint)) return
            const latLng = canvas2latLng(mouseSvgPoint)
            onMousePosition && onMousePosition(latLng)
        },
        [mouseSvgPoint?.x, mouseSvgPoint?.y]
    )

    return (
        <div ref={containerRef} className="w-full h-full relative" >
            <svg
                ref={svgRef}
                width={clientDimensions.width}
                height={clientDimensions.height}
                {...rect2viewBox(actualViewBoxRect)}
                className="map-canvas absolute"
            >
                <defs>
                    <ArrowMarker id={'arrow'} />
                    <ArrowMarker id={'windArrow'} />
                </defs>
                <g>
                    <MapGeometry geometry={geometry}  />
                </g>
                {actualViewBoxRect && (
                    <rect
                        ref={clickCatcherRef}
                        {...rect2SvgRect(actualViewBoxRect)}
                        fill={'transparent'}
                        onClick={onClick}
                        data-drag-target-type={'region'}
                    />
                )}
                {showWind && wind && (
                    <MapWind
                        wind={wind}
                        screen2svgFactor={screen2svgFactor}
                        windTime={windTime}
                        boundingRect={boundingRect}
                    />
                )}
                {false && mouseSvgPoint && pointInRect(actualViewBoxRect)(mouseSvgPoint) && (
                    <MouseCursor
                        point={mouseSvgPoint}
                        screen2svgFactor={screen2svgFactor}
                    />
                )}
                {(actualLegs(legs)).map(([leg, returnLeg]) => (
                    <MapLeg key={leg.id}
                        leg={leg}
                        returnLeg={returnLeg}
                        startBuoy={buoys?.find(idIs(leg.startBuoyId))}
                        endBuoy={buoys?.find(idIs(leg.endBuoyId))}
                        onSelect={onSelectLeg}
                        isSelected={leg.id === selectedLeg?.id}
                    />)
                )}
                {routeLegs && (
                    <MapRoute
                        routeLegs={routeLegs}
                        color={ROUTE_LEG_COLOR}
                        buoys={buoys || []}
                        onSelectLeg={onSelectLeg}
                        selectedLeg={selectedLeg}
                        screen2svgFactor={screen2svgFactor}
                    />)
                }
                {hoverRouteLegs && (
                    <MapRoute
                        routeLegs={hoverRouteLegs}
                        color={ROUTE_LEG_HOVER_COLOR}
                        buoys={buoys || []}
                        onSelectLeg={onSelectLeg}
                        selectedLeg={selectedLeg}
                        screen2svgFactor={screen2svgFactor}
                    />)
                }
                {creatingLeg && (
                    <MapCreatingLeg
                        startBuoy={creatingLeg.startBuoy}
                        endBuoy={creatingLeg.endBuoy}
                    />
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
                {selectedMapRegion && !mouseDragRegion.dragging && (
                    <MapRegion
                        region={selectedMapRegion}
                    />
                )}
                {mouseDragRegion.dragging && mouseDragRegion.mousePosition.start && (
                    <MouseRegion
                        point={clientPoint2svgPoint(svgRef.current, mouseDragRegion.mousePosition.start)}
                        mark={clientPoint2svgPoint(svgRef.current, mouseDragRegion.mousePosition.end)}
                    />
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
                {DEBUG && viewBoxRect && <rect {...rect2SvgRect(viewBoxRect)}
                    stroke={COLOR_BLUE}
                    strokeWidth={1}
                    fill={'transparent'}
                    vectorEffect="non-scaling-stroke"
                />}
            </svg>
        </div>
    )
}

export default MapSvg
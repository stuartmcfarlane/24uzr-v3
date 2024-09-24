import { clientPoint2svgPoint, fmtRect, makePoint, rectGrowAroundPoint, rectLimitTo, rectWidth } from "@/lib/graph";
import { MouseEvent, RefObject, useCallback, useEffect, useRef, useState, WheelEvent } from "react";
import { useChange } from "./useChange";

export const useScrollWheelZoom = (
    svgRef: RefObject<SVGSVGElement>,
    initialBoundingRect?: Rect,
    maxBoundingRect?: Rect
): Rect | undefined => {
    
    const [zoomedViewBoxRect, setZoomedViewBoxRect] = useState<Rect | undefined>(initialBoundingRect)
    
    const maxRef = useRef(maxBoundingRect)
    const zoomedRef = useRef(zoomedViewBoxRect)

    useChange(
        () => {
            if (zoomedRef.current) return
            console.log(`initialBoundingRect changed!`)
            zoomedRef.current = initialBoundingRect
            setZoomedViewBoxRect(initialBoundingRect)
         },
        [initialBoundingRect]
    )
    useChange(
        () => {
            console.log(`maxBoundingRect changed! ${fmtRect(maxBoundingRect)}`)
            maxRef.current = maxBoundingRect
         },
        [maxBoundingRect]
    )
    const onWheel = useCallback(
        (e: WheelEventInit) => {
            console.log(`>onWheel `, e)
            const maxBoundingRect = maxRef.current
            const zoomedViewBoxRect = zoomedRef.current
            console.log(` onWheel `, { svgRef, zoomedViewBoxRect, maxBoundingRect })
            if (
                !svgRef.current
                || undefined === e.clientX
                || undefined === e.clientY
                || undefined === e.deltaY
                || !zoomedViewBoxRect
                || !maxBoundingRect
            ) return
            
            const clientPoint = makePoint(e.clientX, e.clientY)
            const zoomPoint = clientPoint2svgPoint(svgRef.current, clientPoint)
            if (!zoomPoint) return
            const zoomTick = rectWidth(zoomedViewBoxRect) / 100
            const zoomScale = (
                e.deltaY < 0
                    ? zoomTick / e.deltaY
                    : zoomTick * e.deltaY
            )
            const zoomRect = rectGrowAroundPoint(zoomScale, zoomPoint, zoomedViewBoxRect)
            const maxedRect = rectLimitTo(maxBoundingRect, zoomRect)
            console.log(`setZoomedViewBoxRect( ${fmtRect(maxedRect)})`)
            setZoomedViewBoxRect(maxedRect)
        },
        [svgRef, zoomedViewBoxRect, maxBoundingRect]
    )
    
    useEffect(
        () => {
            svgRef.current?.addEventListener('wheel', onWheel)
            return () => {
                svgRef.current?.removeEventListener('wheel', onWheel)
            }
        },
        []
    )
    useEffect(
        () => setZoomedViewBoxRect(initialBoundingRect),
        [initialBoundingRect]
    )
    return zoomedViewBoxRect
}
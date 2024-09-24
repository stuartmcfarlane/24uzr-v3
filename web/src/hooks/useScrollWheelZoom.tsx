import { clientPoint2svgPoint, fmtPoint, fmtReal, fmtRect, makePoint, rectAspectRatio, rectGrowAroundPoint, rectHeight, rectLimitTo, rectWidth } from "@/lib/graph";
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
            zoomedRef.current = initialBoundingRect
            setZoomedViewBoxRect(initialBoundingRect)
        },
        [initialBoundingRect]
    )
    useChange(
        () => {
            zoomedRef.current = zoomedViewBoxRect
        },
        [zoomedViewBoxRect]
    )
    useChange(
        () => {
            maxRef.current = maxBoundingRect
        },
        [maxBoundingRect]
    )
    const scrollDelta2zoomMargin = (rect: Rect, δ: number): number => {
        const Δ = Math.sign(δ) * Math.sqrt(Math.sign(δ) * δ)
        
        const zoomTick = rectWidth(rect) / 500
        const zoomMargin = Δ * zoomTick
        if (zoomMargin < 0) {
            const zoomSpace = Math.min(rectWidth(rect), rectHeight(rect))
            if (Math.abs(zoomMargin) * 2 > zoomSpace) {
                const smallMargin = -zoomSpace / 5
                return smallMargin
            }
        }
        return zoomMargin
    }
    const onWheel = useCallback(
        (e: WheelEventInit) => {
            const maxBoundingRect = maxRef.current
            const zoomedViewBoxRect = zoomedRef.current
            if (
                !svgRef.current
                || undefined === e.clientX
                || undefined === e.clientY
                || undefined === e.deltaY
                || !zoomedViewBoxRect
                || !maxBoundingRect
            ) {
                return
            }
            const zoomMargin = scrollDelta2zoomMargin(zoomedViewBoxRect, e.deltaY)
            const clientPoint = makePoint(e.clientX, e.clientY)
            const zoomPoint = clientPoint2svgPoint(svgRef.current, clientPoint)
            if (!zoomPoint) return
            const zoomRect = rectGrowAroundPoint(zoomMargin, zoomPoint, zoomedViewBoxRect)
            const maxedRect = rectLimitTo(maxBoundingRect, zoomRect)
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
    return zoomedViewBoxRect
}
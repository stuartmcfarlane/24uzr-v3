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
            console.log(`initialBoundingRect received`)
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
        console.log(`>scrollDelta2zoomMargin ${fmtReal(δ)} ${fmtRect(rect)}`)
        console.log(` scrollDelta2zoomMargin α ${rectAspectRatio(rect)}`)
        const Δ = Math.sign(δ) * Math.sqrt(Math.sign(δ) * δ)
        console.log(` scrollDelta2zoomMargin Δ ${fmtReal(Δ)}`)
        
        const zoomTick = rectWidth(rect) / 500
        console.log(` scrollDelta2zoomMargin zoom tick ${fmtReal(zoomTick)}`)
        const zoomMargin = Δ * zoomTick
        console.log(` scrollDelta2zoomMargin zoom margin ${fmtReal(zoomMargin)}`)
        if (zoomMargin < 0) {
            const zoomSpace = Math.min(rectWidth(rect), rectHeight(rect))
            console.log(` scrollDelta2zoomMargin zoom space ${fmtReal(zoomSpace, 4)}`)
            if (Math.abs(zoomMargin) * 2 > zoomSpace) {
                const smallMargin = -zoomSpace / 5
                console.log(`<scrollDelta2zoomMargin fine scale zoom ${fmtReal(smallMargin, 4)}`)
                return smallMargin
            }
        }
        console.log(`<scrollDelta2zoomMargin margin ${fmtReal(zoomMargin)}`)
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
                console.log('BORK')
                return
            }
            console.log(`>onWheel ====================================================`, e)
            console.log(` onWheel ${fmtRect(zoomedViewBoxRect)} ${fmtRect(maxBoundingRect)}`)
            const zoomMargin = scrollDelta2zoomMargin(zoomedViewBoxRect, e.deltaY)
            console.log(` onWheel zoom margin ${fmtReal(zoomMargin)}`)
            const clientPoint = makePoint(e.clientX, e.clientY)
            const zoomPoint = clientPoint2svgPoint(svgRef.current, clientPoint)
            console.log(` onWheel zoom point ${fmtPoint(zoomPoint)}`)
            if (!zoomPoint) return
            const zoomRect = rectGrowAroundPoint(zoomMargin, zoomPoint, zoomedViewBoxRect)
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
    return zoomedViewBoxRect
}
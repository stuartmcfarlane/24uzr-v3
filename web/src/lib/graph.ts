import { IApiPlanOutput, Region } from "@/types/api"
import { RefObject } from "react"
import { LatLng, Line, makePoint, makeRectSafe, makeVector, Point, points2vector, pointTranslate, Rect, rectHeight, rectPoint, rectWidth, unitVector, vectorRotate } from "tslib"
import { vectorScale } from 'tslib';
import { makeRegion, regionUnion } from 'tslib';

const LNG_FACTOR = 100
const LAT_FACTOR = -100
export const latLng2canvasA = ([lng, lat]: [number, number]): [number, number] => {
    return [ lng * LNG_FACTOR, lat * LAT_FACTOR]
}
export const latLng2canvas = ({ lat, lng }: LatLng): Point => {
    return {
        x: lng * LNG_FACTOR,
        y: lat * LAT_FACTOR,
    }
}
export const canvas2latLng = ({ x, y }: Point): LatLng => {
    return {
        lng: x / LNG_FACTOR,
        lat: y / LAT_FACTOR,
    }
}

export type ScaleToViewBoxProps = {
    viewBoxRect?: Rect
}

export const makeScreen2svgFactor = (svgRef: RefObject<SVGSVGElement>): number => {
    if (!svgRef.current) return 1
    const svgP1 = clientPoint2svgPoint(svgRef.current, makePoint(0, 0))
    const svgP2 = clientPoint2svgPoint(svgRef.current, makePoint(100, 0))
    if (!svgP1 || !svgP2) return 1
    const svg100 = svgP2.x - svgP1.x
    const factor =  svg100 / 100
    return factor
}
export const screenUnits2canvasUnits = (factor: number = 1, screenUnits: number): number => {
    return screenUnits * (factor || 1)
}
export const clientPoint2svgPoint = (svg: SVGSVGElement | null, clientPoint: Point): Point | undefined => {
    if (!svg) return undefined
    const svgPoint = svg.createSVGPoint()
    
    svgPoint.x = clientPoint.x
    svgPoint.y = clientPoint.y
    
    const screenCTM = svg.getScreenCTM()
    if (!screenCTM) return undefined

    return svgPoint.matrixTransform(svg.getScreenCTM()?.inverse()) as Point
}

export const domRect2rect = (domRect?: DOMRect): Rect | undefined => {
    if (!domRect) return undefined
    const { x, y, width, height } = domRect
    return [
        {
            x,
            y,
        }, {
            x: x + width,
            y: y + height,
        }
    ]
}

export const rect2SvgRect = (rect: Rect) => {
    const point = rectPoint(rect)
    return {
        x: point.x,
        y: point.y,
        width: rectWidth(rect),
        height: rectHeight(rect),
    }
}
export const line2SvgPath = ([p1, p2]: Line, width: number) => {
    const v = vectorScale(width/2)(unitVector(points2vector(p1, p2)))
    const down = vectorRotate(Math.PI / 2)(v)
    const up = vectorRotate(-Math.PI / 2)(v)
    const a = pointTranslate(down)(p1)
    const b = pointTranslate(down)(p2)
    const c = pointTranslate(up)(p2)
    const d = pointTranslate(up)(p1)
    return {
        d: [
            `M ${a.x} ${a.y}`,
            `L ${b.x} ${b.y}`,
            `L ${c.x} ${c.y}`,
            `L ${d.x} ${d.y}`,
            `Z`
        ].join(' ')
    }
}
export const line2SvgLine = (line: Line) => {
    const [p1, p2] = line
    return {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
    }
}

export const region2rect = (region: Region) => {
    const { lat1, lng1, lat2, lng2} = region
    const p1 = latLng2canvas({lat: lat1, lng: lng1})
    const p2 = latLng2canvas({ lat: lat2, lng: lng2 })
    return makeRectSafe(p1, p2)
}
export const plan2region = (plan: IApiPlanOutput): Region => {
    console.log(`>plan2region`, plan)
    const region = plan.routes.reduce(
        (region: Region, route) => {
            return route.legs.reduce(
                (region: Region, leg) => {
                    return regionUnion(region, makeRegion(leg.leg.startBuoy, leg.leg.endBuoy))
                },
                region
            )
        },
        makeRegion(plan.startBuoy, plan.endBuoy)
    )
    console.log(`<plan2region`, region)
    return region
}
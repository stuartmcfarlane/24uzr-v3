import { latLng2canvas } from "@/lib/graph"
import { Region } from "@/types/api"

export type MapRegionProps = {
    region: Region
}

const MapRegion = (props: MapRegionProps) => {
    const {
        region
    } = props
    const { lat1, lat2, lng1, lng2 } = region
    const point = latLng2canvas({ lng: lng1, lat: lat1 })
    const mark = latLng2canvas({ lng: lng2, lat: lat2 })
    if (!point || !mark) return <></>
    const { x: x1, y: y1 } = point
    const { x: x2, y: y2 } = mark
    return <>
        <rect
            x={Math.min(x1, x1)}
            y={Math.min(y1, y2)}
            width={Math.abs(x2 - x1)}
            height={Math.abs(y2 - y1)}
            stroke={'red'}
            fill="transparent"
            strokeWidth={1}
            strokeDasharray="4 2"
            vectorEffect="non-scaling-stroke"
        />
    </>
}

export default MapRegion
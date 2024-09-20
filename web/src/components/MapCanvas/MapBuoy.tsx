import { latLng2canvas } from "@/lib/graph"
import { IApiBuoyOutput } from "@/types/api"

type MapBuoyProps = {
    buoy: IApiBuoyOutput
}

const MapBuoy = (props: MapBuoyProps & ScaleToViewBoxProps) => {
    const { buoy } = props
    console.log(`MapBuoy`, { buoy, point: latLng2canvas(buoy) })
    const { x, y } = latLng2canvas(buoy)
    const radius = 5
    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={radius}
                stroke={'black'}
                strokeWidth={1}
                fill={'yellow'}
                vectorEffect="non-scaling-stroke"
            />
            <text x={x+10} y={y+10}>{buoy.name}</text>
        </>
    )
}

export default MapBuoy
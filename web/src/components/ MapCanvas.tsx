"use client"

import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"

type MapCanvasProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    onSelectBuoy?: (buoy: IApiBuoyOutput) => void
}

const MapCanvas = (props: MapCanvasProps) => {
    const {
        map,
        buoys,
        onSelectBuoy
    } = props

    return <MapSvg buoys={buoys} onSelectBuoy={onSelectBuoy}/>
}

export default MapCanvas
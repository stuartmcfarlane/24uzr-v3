"use client"

import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"

type MapCanvasProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    selectedBuoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
}

const MapCanvas = (props: MapCanvasProps) => {
    const {
        map,
        buoys,
        selectedBuoy,
        onSelectBuoy
    } = props

    return <MapSvg buoys={buoys} onSelectBuoy={onSelectBuoy} selectedBuoy={selectedBuoy}/>
}

export default MapCanvas
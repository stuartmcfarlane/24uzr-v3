"use client"

import { IApiBuoyOutput, IApiLegOutput, IApiMapOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"

type MapCanvasProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
    selectedBuoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    selectedLeg?: IApiLegOutput
    onSelectLeg?: (buoy?: IApiLegOutput) => void
    onCreateLeg?: (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => void
}

const MapCanvas = (props: MapCanvasProps) => {
    const {
        map,
        buoys,
        legs,
        selectedBuoy,
        onSelectBuoy,
        selectedLeg,
        onSelectLeg,
        onCreateLeg,
    } = props

    return <MapSvg
        buoys={buoys}
        legs={legs}
        onSelectBuoy={onSelectBuoy}
        selectedBuoy={selectedBuoy}
        onSelectLeg={onSelectLeg}
        selectedLeg={selectedLeg}
        onCreateLeg={onCreateLeg}
    />
}

export default MapCanvas
"use client"

import { IApiBuoyOutput, IApiLegOutput, IApiMapOutput, IApiRouteLegOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"

type MapCanvasProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    routeLegs: IApiRouteLegOutput[]
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
        routeLegs,
        selectedBuoy,
        onSelectBuoy,
        selectedLeg,
        onSelectLeg,
        onCreateLeg,
    } = props

    return <MapSvg
        buoys={buoys}
        legs={legs}
        routeLegs={routeLegs}
        onSelectBuoy={onSelectBuoy}
        selectedBuoy={selectedBuoy}
        onSelectLeg={onSelectLeg}
        selectedLeg={selectedLeg}
        onCreateLeg={onCreateLeg}
    />
}

export default MapCanvas
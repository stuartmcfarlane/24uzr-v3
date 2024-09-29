"use client"

import { IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapOutput, IApiRouteLegOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"

type MapCanvasProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    routeLegs?: IApiRouteLegOutput[]
    legs: IApiLegOutput[]
    onClearSelections?: () => void
    selectedBuoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    selectedLeg?: IApiLegOutput
    onSelectLeg?: (buoy?: IApiLegOutput) => void
    onCreateLeg?: (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => void
    creatingLeg?: { startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput}
}

const MapCanvas = (props: MapCanvasProps) => {
    const {
        map,
        buoys,
        legs,
        routeLegs,
        onClearSelections,
        selectedBuoy,
        onSelectBuoy,
        selectedLeg,
        onSelectLeg,
        onCreateLeg,
        creatingLeg,
    } = props

    return <MapSvg
        buoys={buoys}
        legs={legs}
        routeLegs={routeLegs}
        onClearSelections={onClearSelections}
        onSelectBuoy={onSelectBuoy}
        selectedBuoy={selectedBuoy}
        onSelectLeg={onSelectLeg}
        selectedLeg={selectedLeg}
        onCreateLeg={onCreateLeg}
        creatingLeg={creatingLeg}
    />
}

export default MapCanvas
"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiLegOutput, IApiMapOutput, IApiRouteLegOutput, IApiWindOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"
import WindLegend from "./WindLegend"
import { useState } from "react"

type MapCanvasProps = {
    wind?: IApiBulkWind[]
    map?: IApiMapOutput
    buoys?: IApiBuoyOutput[]
    routeLegs?: IApiRouteLegOutput[]
    legs?: IApiLegOutput[]
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
        wind,
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

    const [showWind, setShowWind] = useState(false)
    const onShowWind = (showWind: boolean) => setShowWind(showWind)
    return (
        <div className="border flex-grow flex flex-col">
            <div className="flex-1">
                <MapSvg
                    wind={wind}
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
                    showWind={showWind}
                />
            </div>
            <WindLegend showWind={showWind} onShowWind={onShowWind}/>
        </div>
    )
}

export default MapCanvas
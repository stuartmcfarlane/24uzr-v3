"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiRouteLegOutput, IApiWindOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"
import WindLegend from "./WindLegend"
import { useState } from "react"

type MapCanvasProps = {
    wind?: IApiBulkWind[]
    map?: IApiMapOutput
    buoys?: IApiBuoyOutput[]
    routeLegs?: IApiRouteLegOutput[]
    legs?: IApiLegOutput[]
    geometry: IApiGeometryOutput[]
    onClearSelections?: () => void
    selectedBuoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    selectedLeg?: IApiLegOutput
    onSelectLeg?: (buoy?: IApiLegOutput) => void
    onCreateLeg?: (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => void
    creatingLeg?: { startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput }
    showWind?: boolean
    onShowWind?: (showWind: boolean) => void
}

const MapCanvas = (props: MapCanvasProps) => {
    const {
        wind,
        map,
        buoys,
        legs,
        geometry,
        routeLegs,
        onClearSelections,
        selectedBuoy,
        onSelectBuoy,
        selectedLeg,
        onSelectLeg,
        onCreateLeg,
        creatingLeg,
        showWind,
        onShowWind,
    } = props

    const [timeDelta, setTimeDelta] = useState(0)
    const onTimeDelta = (timeDelta: number) => setTimeDelta(timeDelta)
    return (
        <div className="border flex-grow flex flex-col">
            <div className="flex-1">
                <MapSvg
                    map={map}
                    wind={wind}
                    buoys={buoys}
                    legs={legs}
                    geometry={geometry}
                    routeLegs={routeLegs}
                    onClearSelections={onClearSelections}
                    onSelectBuoy={onSelectBuoy}
                    selectedBuoy={selectedBuoy}
                    onSelectLeg={onSelectLeg}
                    selectedLeg={selectedLeg}
                    onCreateLeg={onCreateLeg}
                    creatingLeg={creatingLeg}
                    showWind={showWind}
                    timeDelta={timeDelta}
                />
            </div>
            <WindLegend
                wind={wind || []}
                showWind={showWind}
                onShowWind={onShowWind}
                timeDelta={timeDelta}
                onTimeDelta={onTimeDelta}
            />
        </div>
    )
}

export default MapCanvas
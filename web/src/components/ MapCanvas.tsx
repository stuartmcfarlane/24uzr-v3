"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiRouteLegOutput, IApiShipOutput, Region } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"
import WindLegend from "./WindLegend"
import { IndexedWind, LatLng, Timestamp } from "tslib"
import { region2rect } from "@/lib/graph"
import { FleshedRouteLeg } from "@/lib/route"

type MapCanvasProps = {
    initialBoundingRegion?: Region
    wind?: IndexedWind[]
    map?: IApiMapOutput
    buoys?: IApiBuoyOutput[]
    routeLegs?: IApiRouteLegOutput[]
    hoverRouteLegs?: IApiRouteLegOutput[]
    legs?: IApiLegOutput[]
    geometry: IApiGeometryOutput[]
    ship?: IApiShipOutput
    onClearSelections?: () => void
    selectedBuoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    onSelectLeg?: (buoy?: IApiLegOutput) => void
    onSelectRouteLeg?: (leg?: FleshedRouteLeg) => void
    onHoverRouteLeg?: (leg?: FleshedRouteLeg) => void
    selectedLeg?: IApiLegOutput
    hoveredRouteLeg?: FleshedRouteLeg
    selectedRouteLeg?: FleshedRouteLeg
    onCreateLeg?: (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => void
    creatingLeg?: { startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput }
    showWind?: boolean
    onShowWind?: (showWind: boolean) => void
    onMousePosition?: (latLng: LatLng) => void
    onMouseDragPosition?: (point?: LatLng, mark?: LatLng) => void
    selectedMapRegion?: Region
    selectedWindTimestamp?: Timestamp
    onSelectWindTimestamp?: (timestamp: Timestamp) => void
}

const MapCanvas = (props: MapCanvasProps) => {
    const {
        initialBoundingRegion,
        wind,
        map,
        buoys,
        legs,
        geometry,
        ship,
        routeLegs,
        hoverRouteLegs,
        onClearSelections,
        selectedBuoy,
        onSelectBuoy,
        selectedLeg,
        onSelectLeg,
        onCreateLeg,
        creatingLeg,
        onSelectRouteLeg,
        onHoverRouteLeg,
        selectedRouteLeg,
        hoveredRouteLeg,
        selectedWindTimestamp,
        onSelectWindTimestamp,
        showWind = false,
        onShowWind,
        onMousePosition,
        onMouseDragPosition,
        selectedMapRegion,
    } = props

    return (
        <div className="border flex-grow flex flex-col">
            <div className="flex-1">
                <MapSvg
                    initialBoundingRect={initialBoundingRegion && region2rect(initialBoundingRegion)}
                    map={map}
                    wind={wind}
                    buoys={buoys}
                    legs={legs}
                    geometry={geometry}
                    routeLegs={routeLegs}
                    hoverRouteLegs={hoverRouteLegs}
                    ship={ship}
                    onClearSelections={onClearSelections}
                    onSelectBuoy={onSelectBuoy}
                    selectedBuoy={selectedBuoy}
                    onSelectLeg={onSelectLeg}
                    selectedLeg={selectedLeg}
                    onCreateLeg={onCreateLeg}
                    creatingLeg={creatingLeg}
                    onSelectRouteLeg={onSelectRouteLeg}
                    onHoverRouteLeg={onHoverRouteLeg}
                    selectedRouteLeg={selectedRouteLeg}
                    hoveredRouteLeg={hoveredRouteLeg}
                    showWind={showWind}
                    selectedWindTimestamp={selectedWindTimestamp}
                    onSelectWindTimestamp={onSelectWindTimestamp}
                    onMousePosition={onMousePosition}
                    onMouseDragPosition={onMouseDragPosition}
                    selectedMapRegion={selectedMapRegion}
                />
            </div>
            <WindLegend
                wind={wind || []}
                showWind={showWind}
                onShowWind={onShowWind}
                selectedWindTimestamp={selectedWindTimestamp}
                onSelectWindTimestamp={onSelectWindTimestamp}
            />
        </div>
    )
}

export default MapCanvas
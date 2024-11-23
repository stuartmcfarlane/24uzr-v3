"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiRouteOutput, IApiShipOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import RouteOptions from "./RouteOptions"
import { plan2region } from "@/lib/graph"
import { bulkWind2indexedWind, IndexedWind, parseShipPolar, Timestamp } from "tslib"

type MapPlanPageClientFunctionsProps = {
    pageRoot: string
    map: IApiMapOutput
    wind: IndexedWind[]
    plan: IApiPlanOutput
    ship: IApiShipOutput
    buoys: IApiBuoyOutput[]
    geometry: IApiGeometryOutput
}

const MapPlanPageClientFunctions = (props: MapPlanPageClientFunctionsProps) => {
    const {
        pageRoot,
        map,
        wind,
        plan,
        ship,
        buoys,
        geometry,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [hoveredRoute, setHoveredRoute] = useState<IApiRouteOutput | undefined>(undefined)
    const [showWind, setShowWind] = useState(true)
    const [selectedWindTimestamp, setSelectedWindTimestamp] = useState<Timestamp>(wind[0]?.timestamp)
    
    const onSelectWindTimestamp = (timestamp: Timestamp) => setSelectedWindTimestamp(timestamp)

    const onShowWind = (showWind: boolean) => setShowWind(showWind)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
    }
    const onSelectLeg = (leg?: IApiLegOutput) => {
        setSelectedLeg(leg)
    }
    const onClearSelection = () => {
        setSelectedBuoy(undefined)
        setSelectedLeg(undefined)
    }
    const onHoverRoute = (route?: IApiRouteOutput) => {
        setHoveredRoute(route)
    }

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-6rem)] md:max-h-[calc(100vh-5rem-4rem-2rem)] flex flex-col gap-5">
                <div className="flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        <span>Plan {plan.name} </span>
                    </h1>
                </div>
                <RouteOptions
                    pageRoot={pageRoot}
                    wind={bulkWind2indexedWind(wind)}
                    shipPolar={parseShipPolar(ship.polar)}
                    plan={plan}
                    routes={plan.routes}
                    onHoverRoute={onHoverRoute}
                    selectedWindTimestamp={selectedWindTimestamp}
                />
            </div>
            <MapCanvas
                initialBoundingRegion={plan2region(plan)}
                map={map}
                geometry={geometry}
                wind={wind}
                buoys={buoys}
                legs={[]}
                onClearSelections={onClearSelection}
                selectedBuoy={selectedBuoy}
                onSelectBuoy={onSelectBuoy}
                selectedLeg={selectedLeg}
                onSelectLeg={onSelectLeg}
                routeLegs={hoveredRoute?.legs}
                showWind={showWind}
                onShowWind={onShowWind}
                selectedWindTimestamp={selectedWindTimestamp}
                onSelectWindTimestamp={onSelectWindTimestamp}
            />
        </div>
    )
}

export default MapPlanPageClientFunctions
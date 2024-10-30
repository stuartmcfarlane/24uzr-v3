"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiRouteLegOutput, IApiRouteOutput, IApiShipOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import RouteOptions from "./RouteOptions"
import { plan2region } from "@/lib/graph"
import { bulkWind2indexedWind, last, parseShipPolar, Timestamp, timestamp2epoch, windAtTime } from "tslib"
import { findRouteLegAtTime, FleshedRouteLeg, fleshenRoute } from "@/lib/route"

type MapPlanRoutePageClientFunctionsProps = {
    pageRoot: string
    ship: IApiShipOutput
    map: IApiMapOutput
    wind: IApiBulkWind[]
    plan: IApiPlanOutput
    route: IApiRouteOutput
    buoys: IApiBuoyOutput[]
    geometry: IApiGeometryOutput
}

const MapPlanRoutePageClientFunctions = (props: MapPlanRoutePageClientFunctionsProps) => {
    const {
        pageRoot,
        ship,
        map,
        wind,
        plan,
        route,
        buoys,
        geometry,
    } = props

    const [indexedWind, setIndexedWind] = useState(bulkWind2indexedWind(wind))
    const [fleshedRoute, setFleshedRoute] = useState(fleshenRoute(parseShipPolar(ship.polar), indexedWind, plan, route))
    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [hoveredRoute, setHoveredRoute] = useState<IApiRouteOutput | undefined>(undefined)
    const [selectedRouteLeg, setSelectedRouteLeg] = useState<FleshedRouteLeg | undefined>(undefined)
    const [hoveredRouteLeg, setHoveredRouteLeg] = useState<FleshedRouteLeg | undefined>(undefined)
    const [showWind, setShowWind] = useState(true)
    const [selectedWindTimestamp, setSelectedWindTimestamp] = useState<Timestamp>(wind[0].timestamp)
    
    const onSelectWindTimestamp = (timestamp: Timestamp) => {
        setSelectedWindTimestamp(timestamp)
        const routeLegAtTime = findRouteLegAtTime(timestamp)(fleshedRoute)
        setSelectedRouteLeg(routeLegAtTime)
    }

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
    const onSelectRouteLeg = (leg?: FleshedRouteLeg) => {
        setSelectedRouteLeg(leg)
        if (!leg) return
        const windTime = windAtTime(indexedWind, leg.startTime).timestamp
        setSelectedWindTimestamp(windTime)
    }
    const onHoverRouteLeg = (leg?: FleshedRouteLeg) => {
        setHoveredRouteLeg(leg)
    }

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-6rem)] md:max-h-[calc(100vh-5rem-4rem-2rem)] flex flex-col gap-4">
                <div className="flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        <span>Route {route.name} </span>
                    </h1>
                </div>
                <RouteOptions
                    pageRoot={pageRoot}
                    shipPolar={ship && parseShipPolar(ship.polar)}
                    wind={indexedWind}
                    plan={plan}
                    routes={plan.routes}
                    onHoverRoute={onHoverRoute}
                    onHoverRouteLeg={onHoverRouteLeg}
                    onSelectRouteLeg={onSelectRouteLeg}
                    selectedRoute={fleshedRoute}
                    selectedRouteLeg={selectedRouteLeg}
                    hoveredRouteLeg={hoveredRouteLeg}
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
                onSelectLeg={onSelectLeg}
                selectedLeg={selectedLeg}
                onSelectRouteLeg={onSelectRouteLeg}
                onHoverRouteLeg={onHoverRouteLeg}
                selectedRouteLeg={selectedRouteLeg}
                hoveredRouteLeg={hoveredRouteLeg}
                routeLegs={fleshedRoute?.legs}
                hoverRouteLegs={hoveredRoute?.legs}
                showWind={showWind}
                onShowWind={onShowWind}
                selectedWindTimestamp={selectedWindTimestamp}
                onSelectWindTimestamp={onSelectWindTimestamp}
            />
        </div>
    )
}

export default MapPlanRoutePageClientFunctions
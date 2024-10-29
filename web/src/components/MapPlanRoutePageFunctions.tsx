"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiRouteLegOutput, IApiRouteOutput, IApiShipOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import RouteOptions from "./RouteOptions"
import { plan2region } from "@/lib/graph"
import { bulkWind2indexedWind, parseShipPolar } from "tslib"

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

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [hoveredRoute, setHoveredRoute] = useState<IApiRouteOutput | undefined>(undefined)
    const [selectedRouteLeg, setSelectedRouteLeg] = useState<IApiRouteLegOutput | undefined>(undefined)
    const [hoveredRouteLeg, setHoveredRouteLeg] = useState<IApiRouteLegOutput | undefined>(undefined)
    const [showWind, setShowWind] = useState(true)
    const [windTime, setWindTime] = useState(0)

    const onWindTime = (windTime: number) => setWindTime(windTime)

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
    const onSelectRouteLeg = (leg?: IApiRouteLegOutput) => {
        setSelectedRouteLeg(leg)
    }
    const onHoverRouteLeg = (leg?: IApiRouteLegOutput) => {
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
                    wind={bulkWind2indexedWind(wind)}
                    plan={plan}
                    routes={plan.routes}
                    onHoverRoute={onHoverRoute}
                    onHoverLeg={onHoverRouteLeg}
                    selectedRoute={route}
                    selectedLeg={selectedRouteLeg}
                    hoveredLeg={hoveredRouteLeg}
                    windTime={windTime}
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
                routeLegs={route.legs}
                hoverRouteLegs={hoveredRoute?.legs}
                showWind={showWind}
                onShowWind={onShowWind}
                windTime={windTime}
                onWindTime={onWindTime}
            />
        </div>
    )
}

export default MapPlanRoutePageClientFunctions
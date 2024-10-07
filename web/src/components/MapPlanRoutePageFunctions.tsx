"use client"

import { IApiBuoyOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiRouteOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import RouteOptions from "./RouteOptions"

type MapPlanRoutePageClientFunctionsProps = {
    map: IApiMapOutput
    plan: IApiPlanOutput
    route: IApiRouteOutput
    buoys: IApiBuoyOutput[]
}

const MapPlanRoutePageClientFunctions = (props: MapPlanRoutePageClientFunctionsProps) => {
    const {
        map,
        plan,
        route,
        buoys,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [hoveredRoute, setHoveredRoute] = useState<IApiRouteOutput | undefined>(undefined)

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

    console.log(`route`, route)
    return (
        <div className="flex-grow my-10 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-10rem)] md:max-h-[calc(100vh-5rem-4rem-6rem)] flex flex-col gap-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl flex gap-4">
                        <span>Route {route.name} </span>
                    </h1>
                </div>
                <RouteOptions
                    plan={plan}
                    routes={plan.routes}
                    onHoverRoute={onHoverRoute}
                    selectedRoute={route}
                />
            </div>
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas
                        map={map}
                        buoys={buoys}
                        legs={[]}
                        onClearSelections={onClearSelection}
                        selectedBuoy={selectedBuoy}
                        onSelectBuoy={onSelectBuoy}
                        selectedLeg={selectedLeg}
                        onSelectLeg={onSelectLeg}
                        routeLegs={route.legs}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapPlanRoutePageClientFunctions
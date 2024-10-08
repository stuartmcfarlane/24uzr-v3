"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiRouteOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import RouteOptions from "./RouteOptions"

type MapPlanPageClientFunctionsProps = {
    map: IApiMapOutput
    wind: IApiBulkWind[]
    plan: IApiPlanOutput
    buoys: IApiBuoyOutput[]
}

const MapPlanPageClientFunctions = (props: MapPlanPageClientFunctionsProps) => {
    const {
        map,
        wind,
        plan,
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

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-6rem)] md:max-h-[calc(100vh-5rem-4rem-2rem)] flex flex-col gap-5">
                <div className="flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        <span>Plan {plan.name} </span>
                    </h1>
                </div>
                <RouteOptions
                    plan={plan}
                    routes={plan.routes}
                    onHoverRoute={onHoverRoute}
                />
            </div>
            <MapCanvas
                map={map}
                wind={wind}
                buoys={buoys}
                legs={[]}
                onClearSelections={onClearSelection}
                selectedBuoy={selectedBuoy}
                onSelectBuoy={onSelectBuoy}
                selectedLeg={selectedLeg}
                onSelectLeg={onSelectLeg}
                routeLegs={hoveredRoute?.legs}
            />
        </div>
    )
}

export default MapPlanPageClientFunctions
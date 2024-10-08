"use client"

import { IApiBuoyOutput, IApiLegOutput, IApiMapOutput, IApiRouteLegOutput, IApiRouteOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import routeRoutes from '../../../api/src/modules/route/route.route';

type MapRoutePageClientFunctionsProps = {
    map: IApiMapOutput
    route: IApiRouteOutput
    buoys: IApiBuoyOutput[]
    routeLegs: IApiRouteLegOutput[]
}

const MapRoutePageClientFunctions = (props: MapRoutePageClientFunctionsProps) => {
    const {
        map,
        route,
        buoys,
        routeLegs,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)

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

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-6rem)] md:max-h-[calc(100vh-5rem-4rem-2rem)] flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        <span>Route {route.name} </span>
                    </h1>
                </div>
            </div>
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas
                        map={map}
                        buoys={buoys}
                        legs={[]}
                        onClearSelections={onClearSelection}
                        routeLegs={routeLegs}
                        selectedBuoy={selectedBuoy}
                        onSelectBuoy={onSelectBuoy}
                        selectedLeg={selectedLeg}
                        onSelectLeg={onSelectLeg}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapRoutePageClientFunctions
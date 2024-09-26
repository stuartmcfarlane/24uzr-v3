"use client"

import { IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapOutput, IApiRouteOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useEffect, useState } from "react"
import { createLeg, deleteBuoy, updateMap } from "@/actions/map"
import { idIs } from "@/lib/fp"
import PadlockIcon from "./Icons/PadlockIcon"
import BuoyIcon from "./Icons/BuoyIcon"
import useKeyPress from "@/hooks/useKeyPress"
import { useChange } from "@/hooks/useChange"
import ChartIcon from "./Icons/ChartIcon"
import BuoyOptions from "./BuoyOptions"
import ChartOptions from "./ChartOptions"
import { legsOnRoute } from '../../../api/src/modules/route/route.schema';

type MapRoutePageClientFunctionsProps = {
    map: IApiMapOutput
    route: IApiRouteOutput
    buoys: IApiBuoyOutput[]
}

const MapRoutePageClientFunctions = (props: MapRoutePageClientFunctionsProps) => {
    const {
        map,
        route,
        buoys,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
    }
    const onSelectLeg = (leg?: IApiLegOutput) => {
        setSelectedLeg(leg)
    }


    return (
        <div className="flex-grow my-10 flex gap-4">
            <div className="flex flex-col">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-2xl flex gap-4">
                        <span>Route {route.name} </span>
                    </h1>
                </div>
            </div>
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas
                        map={map}
                        buoys={buoys}
                        legs={route.legs}
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
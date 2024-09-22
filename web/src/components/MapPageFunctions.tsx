"use client"

import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import AddBuoyForm from "./AddBuoyForm"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import EditBuoyForm from "./EditBuoyForm"

type MapPageClientFunctionsProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
}

const MapPageClientFunctions = (props: MapPageClientFunctionsProps) => {
    const {
        map,
        buoys,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
    }
    return (
        <div className="flex-grow my-10 flex gap-4">
            {selectedBuoy ? (
                <div className="">
                    <h1 className="text-2xl">Map {map?.name}</h1>
                    <EditBuoyForm map={map} buoy={selectedBuoy} onSelectBuoy={onSelectBuoy} />
                </div>
            ) : (
                <div className="">
                    <h1 className="text-2xl">Map {map?.name}</h1>
                    <AddBuoyForm map={map} />
                </div>
            )}
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas
                        map={map}
                        buoys={buoys}
                        selectedBuoy={selectedBuoy} 
                        onSelectBuoy={onSelectBuoy}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapPageClientFunctions
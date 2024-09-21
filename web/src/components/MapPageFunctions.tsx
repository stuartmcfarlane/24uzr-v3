"use client"

import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import AddBuoyForm from "./AddBuoyForm"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import EditBuoyForm from "./EditBuoyForm"

type MapPageClientFunctionsProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
}

const MapPageClientFunctions = (props: MapPageClientFunctionsProps) => {
    const {
        map,
        buoys,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | null>(null)

    const onSelectBuoy = (buoy: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
        console.log(`buoy selected`, buoy)
    }
    return (
        <div className="flex-grow my-10 flex gap-4">
            {selectedBuoy ? (
                <div className="">
                    <h1 className="text-2xl">Map {map?.name}</h1>
                    <EditBuoyForm map={map} buoy={selectedBuoy} />
                </div>
            ) : (
                <div className="">
                    <h1 className="text-2xl">Map {map?.name}</h1>
                    <AddBuoyForm map={map} />
                </div>
            )}
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas map={map} buoys={buoys} onSelectBuoy={onSelectBuoy}/>
                </div>
            </div>
        </div>
    )
}

export default MapPageClientFunctions
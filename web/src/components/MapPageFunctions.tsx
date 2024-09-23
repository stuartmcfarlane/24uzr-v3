"use client"

import { IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapOutput } from "@/types/api"
import AddBuoyForm from "./AddBuoyForm"
import MapCanvas from "./ MapCanvas"
import { useEffect, useState } from "react"
import EditBuoyForm from "./EditBuoyForm"
import { createLeg } from "@/actions/map"

type MapPageClientFunctionsProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
}

const MapPageClientFunctions = (props: MapPageClientFunctionsProps) => {
    const {
        map,
        buoys,
        legs,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [createdLeg, setCreatedLeg] = useState<IApiLegInput | undefined>(undefined)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
    }
    const onSelectLeg = (leg?: IApiLegOutput) => {
        setSelectedLeg(leg)
    }

    useEffect(
        () => {
            if (createdLeg) {
                const createTheLeg = async () => {
                    await createLeg(createdLeg)
                    setCreatedLeg(undefined)
                }
                createTheLeg()
            }
        },
        [ createdLeg ]
    )
    const onCreateLeg = (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => {
        setCreatedLeg({
            mapId: map.id,
            startBuoyId: startBuoy.id,
            endBuoyId: endBuoy.id,
        })
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
                        legs={legs}
                        selectedBuoy={selectedBuoy}
                        onSelectBuoy={onSelectBuoy}
                        selectedLeg={selectedLeg}
                        onSelectLeg={onSelectLeg}
                        onCreateLeg={onCreateLeg}
                    />
                </div>
            </div>
        </div>
    )
}

export default MapPageClientFunctions
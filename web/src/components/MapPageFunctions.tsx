"use client"

import { IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapOutput } from "@/types/api"
import AddBuoyForm from "./AddBuoyForm"
import MapCanvas from "./ MapCanvas"
import { useEffect, useState } from "react"
import EditBuoyForm from "./EditBuoyForm"
import { createLeg } from "@/actions/map"
import { idIs } from "@/lib/fp"

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
                const startBuoy = buoys.find(idIs(createdLeg.startBuoyId))
                const endBuoy = buoys.find(idIs(createdLeg.endBuoyId))
                if (!startBuoy || !endBuoy) {
                    setCreatedLeg(undefined)
                    return
                }
                const createLegs = async (legs: IApiLegInput[]) => {
                    await Promise.all(legs.map(createLeg))
                    setCreatedLeg(undefined)
                }
                const reverseLeg = (leg: IApiLegInput) => ({
                    ...leg,
                    startBuoyId: leg.endBuoyId,
                    endBuoyId: leg.startBuoyId,
                })
                if (/\(start\)/i.test(startBuoy.name)) {
                    createLegs([createdLeg])
                    return
                }
                if (/\(finish\)/i.test(endBuoy.name)) {
                    createLegs([createdLeg])
                    return
                }
                if (/^start$/i.test(endBuoy.name) || /^finish$/i.test(startBuoy.name)) {
                    return
                }
                createLegs([
                    createdLeg,
                    reverseLeg(createdLeg),
                ])
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
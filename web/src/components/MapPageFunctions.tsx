"use client"

import { IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapOutput } from "@/types/api"
import AddBuoyForm from "./AddBuoyForm"
import MapCanvas from "./ MapCanvas"
import { useEffect, useState } from "react"
import EditBuoyForm from "./EditBuoyForm"
import { createLeg, deleteBuoy, updateMap } from "@/actions/map"
import { idIs } from "@/lib/fp"
import PadlockIcon from "./PadlockIcon"
import BuoyIcon from "./BuoyIcon"
import useKeyPress from "@/hooks/useKeyPress"
import { useChange } from "@/hooks/useChange"

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

    const [buoyOptionsOpen, setBuoyOptionsOpen] = useState(false)
    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [createdLeg, setCreatedLeg] = useState<IApiLegInput | undefined>(undefined)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
    }
    const onSelectLeg = (leg?: IApiLegOutput) => {
        setSelectedLeg(leg)
    }
    const onDeleteBuoy = async (buoy: IApiBuoyOutput) => {
        await deleteBuoy(buoy)
        onSelectBuoy()
    }
    const deleteKeyPressed = useKeyPress(["Delete", "Backspace"])

    useChange(
        () => {
            if (deleteKeyPressed && selectedBuoy) {
                onDeleteBuoy(selectedBuoy)
            }
        },
        [deleteKeyPressed]
    )

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
        if (map.isLocked) return
        setCreatedLeg({
            mapId: map.id,
            startBuoyId: startBuoy.id,
            endBuoyId: endBuoy.id,
        })
    }
    const onToggleMapLock = async () => {
        await updateMap(map.id, {
            ...map,
            isLocked: !map.isLocked,
        })
    }

    return (
        <div className="flex-grow my-10 flex gap-4">
            <div className="">
                <h1 className="text-2xl flex gap-4">
                    <span>Map {map?.name} </span>
                    <span className="w-7">
                        <PadlockIcon isLocked={map.isLocked} onClick={onToggleMapLock} />
                    </span>
                </h1>
                {!map.isLocked && (
                    <div className="flex flex-col gap-4 mt-4 border-t-2 pt-4">
                        <div
                            className="flex gap-4"
                            onClick={() => setBuoyOptionsOpen(open => !open)}
                        >
                            <div className="w-7">
                                <BuoyIcon/>
                            </div>
                            <div className="">
                                {buoyOptionsOpen ? 'Hide buoy options' : 'Show buoy options'}
                            </div>
                        </div>
                        {buoyOptionsOpen && (
                            selectedBuoy ? (
                                <EditBuoyForm
                                    map={map}
                                    buoy={selectedBuoy}
                                    onSelectBuoy={onSelectBuoy}
                                    onDeleteBuoy={onDeleteBuoy}
                                />
                            ) : (
                                <AddBuoyForm map={map} />
                            )
                        )}
                    </div>
                )}
            </div>
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
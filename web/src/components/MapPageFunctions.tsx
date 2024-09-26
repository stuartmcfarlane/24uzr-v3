"use client"

import { IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapOutput, IApiRouteOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useEffect, useState } from "react"
import { createLeg, deleteBuoy, updateMap } from "@/actions/map"
import { idIs, maybeFinishBuoy } from "@/lib/fp"
import PadlockIcon from "./Icons/PadlockIcon"
import BuoyIcon from "./Icons/BuoyIcon"
import useKeyPress from "@/hooks/useKeyPress"
import { useChange } from "@/hooks/useChange"
import ChartIcon from "./Icons/ChartIcon"
import BuoyOptions from "./BuoyOptions"
import ChartOptions from "./ChartOptions"
import RouteOptions from "./RouteOptions"

type MapPageClientFunctionsProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
    routes: IApiRouteOutput[]
}

const MapPageClientFunctions = (props: MapPageClientFunctionsProps) => {
    const {
        map,
        buoys,
        legs,
        routes,
    } = props

    const [buoyOptionsOpen, setBuoyOptionsOpen] = useState(false)
    const [chartOptionsOpen, setChartOptionsOpen] = useState(false)
    const [routeOptionsOpen, setRouteOptionsOpen] = useState(false)
    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [deletedBuoy, setDeletedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [createdLeg, setCreatedLeg] = useState<IApiLegInput | undefined>(undefined)
    const [startBuoy, setStartBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [endBuoy, setEndBuoy] = useState<IApiBuoyOutput | undefined>(undefined)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
        setBuoyOptionsOpen(!!buoy)
        setStartBuoy(buoy)
    }
    const onSelectLeg = (leg?: IApiLegOutput) => {
        setSelectedLeg(leg)
    }
    const onDeleteBuoy = (buoy?: IApiBuoyOutput) => {
        setDeletedBuoy(buoy)
    }
    const deleteKeyPressed = useKeyPress(["Delete", "Backspace"])

    useChange(
        () => {
            const endBuoy = buoys.find(maybeFinishBuoy)
            setEndBuoy(endBuoy)
        },
        [buoys]
    )
    useChange(
        () => {
            if (deleteKeyPressed && selectedBuoy && !map.isLocked) {
                onDeleteBuoy(selectedBuoy)
            }
        },
        [deleteKeyPressed]
    )
    useChange(
        async () => {
            if (deletedBuoy) {
                await deleteBuoy(deletedBuoy)
                setDeletedBuoy(undefined)
                onSelectBuoy()
            }
        },
        [deletedBuoy]
    )
    useChange(
        async () => {
            if (startBuoy) setRouteOptionsOpen(true)
        },
        [startBuoy]
    )
    useChange(
        async () => {
            if (!routeOptionsOpen) {
                setSelectedBuoy(undefined)
                setStartBuoy(undefined)
            }
        },
        [routeOptionsOpen]
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
        [ buoys, createdLeg ]
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
            <div className="flex flex-col">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-2xl flex gap-4">
                        <span>Map {map?.name} </span>
                        <span className="w-7">
                            <PadlockIcon isLocked={map.isLocked} onClick={onToggleMapLock} />
                        </span>
                    </h1>
                    <div className="flex-1 flex flex-col gap-4 mt-4 border-t-2 pt-4">
                        {!map.isLocked && (<>
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
                                <BuoyOptions
                                    map={map}
                                    buoy={selectedBuoy}
                                    onSelectBuoy={onSelectBuoy}
                                    onDeleteBuoy={onDeleteBuoy}
                                />
                            )}
                            <div
                                className="flex gap-4"
                                onClick={() => setChartOptionsOpen(open => !open)}
                            >
                                <div className="w-7">
                                    <ChartIcon/>
                                </div>
                                <div className="">
                                    {chartOptionsOpen ? 'Hide chart options' : 'Show chart options'}
                                </div>
                            </div>
                            {chartOptionsOpen && (
                                <ChartOptions
                                    map={map}
                                />
                            )}
                        </>)}
                        <div className="flex gap-4"
                            onClick={() => setRouteOptionsOpen(open => !open)}
                        >
                            <div className="w-7">
                                <BuoyIcon/>
                            </div>
                            <div className="">
                                {routeOptionsOpen ? 'Hide route options' : 'Show route options'}
                            </div>
                        </div>
                        {routeOptionsOpen && (<>
                            <RouteOptions
                                map={map}
                                routes={routes}
                                startBuoy={startBuoy}
                                endBuoy={endBuoy}
                            />
                        </>)}
                    </div>
                </div>
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
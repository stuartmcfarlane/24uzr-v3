"use client"

import { IApiBuoyOutput, IApiGeometryOutput, IApiLegInput, IApiLegOutput, IApiMapOutput, IApiRouteOutput, PartialRegion, Region } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useEffect, useState } from "react"
import { createLeg, deleteBuoy, updateMap } from "@/actions/map"
import { idIs } from "tslib"
import PadlockIcon from "./Icons/PadlockIcon"
import BuoyIcon from "./Icons/BuoyIcon"
import useKeyPress from "@/hooks/useKeyPress"
import { useChange } from "@/hooks/useChange"
import ChartIcon from "./Icons/ChartIcon"
import BuoyOptions from "./BuoyOptions"
import ChartOptions from "./ChartOptions"
import GeometryIcon from "./Icons/GeometryIcon"
import GeometryOptions from "./GeometryOptions"
import { realEq } from "@/lib/math"

type UnlockedMapPageClientFunctionsProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
    geometry: IApiGeometryOutput[]
}

const UnlockedMapPageClientFunctions = (props: UnlockedMapPageClientFunctionsProps) => {
    const {
        map,
        buoys,
        legs,
        geometry,
    } = props

    const [buoyOptionsOpen, setBuoyOptionsOpen] = useState(false)
    const [geometryOptionsOpen, setGeometryOptionsOpen] = useState(false)
    const [chartOptionsOpen, setChartOptionsOpen] = useState(false)
    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [deletedBuoy, setDeletedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [createdLeg, setCreatedLeg] = useState<IApiLegInput | undefined>(undefined)
    const [selectedMapRegion, setSelectedMapRegion] = useState<Region | undefined>(undefined)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
        setBuoyOptionsOpen(!!buoy)
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
            if (deleteKeyPressed && selectedBuoy) {
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
    const onClearSelection = () => {
        setSelectedBuoy(undefined)
        setSelectedLeg(undefined)
    }
    const onMouseDragPosition = (point?: LatLng, mark?: LatLng) => {
        if (!point || !mark) return

        const lat1 = Math.min(point.lat, mark.lat)
        const lat2 = Math.max(point.lat, mark.lat)
        const lng1 = Math.min(point.lng, mark.lng)
        const lng2 = Math.max(point.lng, mark.lng)

        if (realEq(.0001)(lat1, lat2) && realEq(.0001)(lng1, lng2)) {
            setSelectedMapRegion(undefined)
            return
        }
        setSelectedMapRegion({ lat1, lng1, lat2, lng2 })
    }

    if (map.isLocked) return <></>

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="flex flex-col">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        <span>Map {map?.name} </span>
                        <span className="w-7">
                            <PadlockIcon isLocked={false} onClick={onToggleMapLock} />
                        </span>
                    </h1>
                    <div className="flex-1 flex flex-col gap-4 mt-4 border-t-2 pt-4">
                        <div
                            className="flex gap-4"
                            onClick={() => setGeometryOptionsOpen(open => !open)}
                        >
                            <div className="w-7">
                                <GeometryIcon/>
                            </div>
                            <div className="">
                                {geometryOptionsOpen ? 'Hide geometry options' : 'Show geometry options'}
                            </div>
                        </div>
                        {geometryOptionsOpen && (
                            <GeometryOptions
                                map={map}
                                selectedMapRegion={selectedMapRegion}
                            />
                        )}
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
                    </div>
                </div>
            </div>
            <MapCanvas
                map={map}
                buoys={buoys}
                legs={legs}
                geometry={geometry}
                onClearSelections={onClearSelection}
                selectedBuoy={selectedBuoy}
                onSelectBuoy={onSelectBuoy}
                selectedLeg={selectedLeg}
                onSelectLeg={onSelectLeg}
                onCreateLeg={onCreateLeg}
                onMouseDragPosition={onMouseDragPosition}
                selectedMapRegion={selectedMapRegion}
            />
        </div>
    )
}

export default UnlockedMapPageClientFunctions
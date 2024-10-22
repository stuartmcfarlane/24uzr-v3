"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiShipOutput, IApiWindOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import { updateMap } from "@/actions/map"
import { maybeFinishBuoy } from "tslib"
import PadlockIcon from "./Icons/PadlockIcon"
import { useChange } from "@/hooks/useChange"
import PlanOptions from "./PlanOptions"

type LockedMapPageClientFunctionsProps = {
    map: IApiMapOutput
    ships: IApiShipOutput[]
    wind: IApiBulkWind[]
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
    plans: IApiPlanOutput[]
    geometry: IApiGeometryOutput
}

const LockedMapPageClientFunctions = (props: LockedMapPageClientFunctionsProps) => {
    const {
        map,
        ships,
        wind,
        buoys,
        legs,
        plans,
        geometry,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [startBuoy, setStartBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [endBuoy, setEndBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [finishBuoy, setFinishBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [creatingLeg, setCreatingLeg] = useState<{startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput} | undefined>(undefined)
    const [hoveredPlan, setHoveredPlan] = useState<IApiPlanOutput | undefined>(undefined)
    const [showWind, setShowWind] = useState(true)
    const [activeShip, setActiveShip] = useState(ships?.length === 1 ? ships[0] : undefined)
    const onShowWind = (showWind: boolean) => setShowWind(showWind)

    const onClearSelection = () => {
        setStartBuoy(undefined)
        setEndBuoy(undefined)
        setCreatingLeg(undefined)
    }
    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
        if (!endBuoy) {
            setStartBuoy(buoy)
        }
    }
    useChange(
        () => {
            setFinishBuoy(buoys.find(maybeFinishBuoy))
        },
        [buoys]
    )
    const onCreateLeg = (startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput) => {
        setEndBuoy(endBuoy)
        setStartBuoy(startBuoy)
        setCreatingLeg({
            startBuoy,
            endBuoy,
        })
    }
    const onToggleMapLock = async () => {
        await updateMap(map.id, {
            ...map,
            isLocked: !map.isLocked,
        })
    }
    const onHoverPlan = (plan?: IApiPlanOutput) => {
        setHoveredPlan(plan)
    }
    const onSelectShip = (ship?: IApiShipOutput) => {
        setActiveShip(ship)
    }
    if (!map.isLocked) return <></>

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-6rem)] md:max-h-[calc(100vh-5rem-4rem-2rem)] flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        <span>Map {map?.name} </span>
                        <span className="w-7">
                            <PadlockIcon isLocked={map.isLocked} onClick={onToggleMapLock} />
                        </span>
                    </h1>
                    <div className="flex-1 flex flex-col gap-4 mt-4 border-t-2 pt-4">
                        <PlanOptions
                            map={map}
                            ships={ships}
                            plans={plans}
                            startBuoy={creatingLeg?.startBuoy || startBuoy}
                            endBuoy={creatingLeg?.endBuoy || endBuoy || finishBuoy}
                            onHoverPlan={onHoverPlan}
                            activeShip={activeShip}
                            onSelectShip={onSelectShip}
                        />
                    </div>
                </div>
            </div>
            <MapCanvas
                map={map}
                geometry={geometry}
                wind={wind}
                buoys={buoys}
                legs={legs}
                ship={activeShip}
                onClearSelections={onClearSelection}
                selectedBuoy={selectedBuoy}
                onSelectBuoy={onSelectBuoy}
                onCreateLeg={onCreateLeg}
                creatingLeg={creatingLeg}
                showWind={showWind}
                onShowWind={onShowWind}
            
            />
        </div>
    )
}

export default LockedMapPageClientFunctions
"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiShipOutput, IApiUserOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import { maybeFinishBuoy, Timestamp } from "tslib"
import { useChange } from "@/hooks/useChange"
import PlanOptions from "./PlanOptions"
import { isActive } from "@/lib/ships"
import SelectShipForm from "./SelectShipForm"
import { updateActiveShip } from "@/actions/ship"

type RacePageClientFunctionsProps = {
    user: IApiUserOutput
    map: IApiMapOutput
    ships: IApiShipOutput[]
    wind: IApiBulkWind[]
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
    plans: IApiPlanOutput[]
    geometry: IApiGeometryOutput
}

const RacePageClientFunctions = (props: RacePageClientFunctionsProps) => {
    const {
        user,
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
    const [activeShip, setActiveShip] = useState<IApiShipOutput|undefined>(ships.find(isActive) || ships[0])
    const [selectedWindTimestamp, setSelectedWindTimestamp] = useState<Timestamp>(wind[0].timestamp)
    
    const onSelectWindTimestamp = (timestamp: Timestamp) => setSelectedWindTimestamp(timestamp)

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
    const onHoverPlan = (plan?: IApiPlanOutput) => {
        setHoveredPlan(plan)
    }
    const onSelectShip = async (ship?: IApiShipOutput) => {
        if (ship?.id !== activeShip?.id) {
            const newActiveShip = await updateActiveShip(user.id, ship)
            setActiveShip(newActiveShip || ship)
        }
    }
    if (!map.isLocked) return <div>Error - map is locked</div>

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-6rem)] md:max-h-[calc(100vh-5rem-4rem-2rem)] flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        {activeShip && (<>
                            <span>{activeShip.name} </span>
                        </>)}
                        {!activeShip && (<>
                            <SelectShipForm ships={ships} onSelectShip={onSelectShip}/>
                        </>)}
                    </h1>
                    <div className="flex-1 flex flex-col gap-4 mt-4 border-t-2 pt-4">
                        <PlanOptions
                            rootPage="/race"
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
                selectedWindTimestamp={selectedWindTimestamp}
                onSelectWindTimestamp={onSelectWindTimestamp}
            />
        </div>
    )
}

export default RacePageClientFunctions


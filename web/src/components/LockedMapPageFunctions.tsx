"use client"

import { IApiBuoyOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useState } from "react"
import { updateMap } from "@/actions/map"
import { maybeFinishBuoy } from "@/lib/fp"
import PadlockIcon from "./Icons/PadlockIcon"
import { useChange } from "@/hooks/useChange"
import PlanOptions from "./PlanOptions"

type LockedMapPageClientFunctionsProps = {
    map: IApiMapOutput
    buoys: IApiBuoyOutput[]
    legs: IApiLegOutput[]
    plans: IApiPlanOutput[]
}

const LockedMapPageClientFunctions = (props: LockedMapPageClientFunctionsProps) => {
    const {
        map,
        buoys,
        legs,
        plans,
    } = props

    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [startBuoy, setStartBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [endBuoy, setEndBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [finishBuoy, setFinishBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [creatingLeg, setCreatingLeg] = useState<{startBuoy: IApiBuoyOutput, endBuoy: IApiBuoyOutput} | undefined>(undefined)
    const [hoveredPlan, setHoveredPlan] = useState<IApiPlanOutput | undefined>(undefined)

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

    if (!map.isLocked) return <></>

    return (
        <div className="flex-grow my-10 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-10rem)] md:max-h-[calc(100vh-5rem-4rem-6rem)] flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-2xl flex gap-4">
                        <span>Map {map?.name} </span>
                        <span className="w-7">
                            <PadlockIcon isLocked={map.isLocked} onClick={onToggleMapLock} />
                        </span>
                    </h1>
                    <div className="flex-1 flex flex-col gap-4 mt-4 border-t-2 pt-4">
                        <PlanOptions
                            map={map}
                            plans={plans}
                            startBuoy={creatingLeg?.startBuoy || startBuoy}
                            endBuoy={creatingLeg?.endBuoy || endBuoy || finishBuoy}
                            onHoverPlan={onHoverPlan}
                        />
                    </div>
                </div>
            </div>
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas
                        map={map}
                        buoys={buoys}
                        legs={legs}
                        onClearSelections={onClearSelection}
                        selectedBuoy={selectedBuoy}
                        onSelectBuoy={onSelectBuoy}
                        onCreateLeg={onCreateLeg}
                        creatingLeg={creatingLeg}
                        // routeLegs={hoveredPlan?.legs}
                    />
                </div>
            </div>
        </div>
    )
}

export default LockedMapPageClientFunctions
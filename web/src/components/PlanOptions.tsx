"use client"

import { IApiBuoyOutput, IApiMapOutput, IApiPlanOutput, IApiShipOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewPlanTool } from "./NewPlanTool"
import PlanIcon from "./Icons/PlanIcon"
import { ChangeEvent } from 'react'
import { and, idIs, not, plural, seconds2hours, sort } from "tslib"
import { cmpStartTime, planHasShip, planIsOld } from "@/lib/plan"
import { fmtHumanDateTime } from 'tslib';
import PlanOption from "./PlanOption"

type PlanOptionsProps = {
    rootPage: string
    map: IApiMapOutput
    ships: IApiShipOutput[]
    plans: IApiPlanOutput[]
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onHoverPlan?: (plan?: IApiPlanOutput) => void
    activeShip?: IApiShipOutput
    onSelectShip?: (ship?: IApiShipOutput) => void
}
const PlanOptions = (props: PlanOptionsProps) => {
    const {
        rootPage,
        map,
        ships,
        plans,
        startBuoy,
        endBuoy,
        onHoverPlan,
        activeShip,
        onSelectShip,
    } = props

    const onSelectChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        onSelectShip && onSelectShip(ships.find(idIs(parseInt(e.target.value))))
    }
    return (<>
        {ships.length > 1 && (
            <select
                value={activeShip?.id}
                onChange={onSelectChanged}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                {ships.map(ship => (
                    <option
                        key={ship.id}
                        value={ship.id}
                    >
                        {ship.name}
                    </option>
                ))}
            </select>
        )}
        {!startBuoy && (<>
            <div className="flex gap-4">
                <div className="w-7">
                    <PlanIcon/>
                </div>
                <div className="">
                    Plans
                </div>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto pr-4">
                {sort(cmpStartTime)(
                    (plans || [])
                    .filter(and(planHasShip(activeShip), not(planIsOld(24))))
                ).map(plan => (
                    <PlanOption
                        key={plan.id}
                        rootPage={rootPage}
                        plan={plan}
                        onHoverPlan={onHoverPlan}
                    />
                ))}
            </div>
        </>)}
        {activeShip && startBuoy && (
            <NewPlanTool
                rootPage={rootPage}
                map={map}
                ship={activeShip}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default PlanOptions
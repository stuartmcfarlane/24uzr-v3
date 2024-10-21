"use client"

import { IApiBuoyOutput, IApiMapOutput, IApiPlanOutput, IApiShipOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewPlanTool } from "./NewPlanTool"
import PlanIcon from "./Icons/PlanIcon"
import { ChangeEvent } from 'react'
import { idIs } from "tslib"

type PlanOptionsProps = {
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
        map,
        ships,
        plans,
        startBuoy,
        endBuoy,
        onHoverPlan,
        activeShip,
        onSelectShip,
    } = props

    const onMouseEnter = (plan: IApiPlanOutput) => () => onHoverPlan && onHoverPlan(plan)
    const onMouseLeave = (plan: IApiPlanOutput) => () => onHoverPlan && onHoverPlan()
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
                {(plans || []).map(plan => (
                    <div
                        key={plan.id}
                        className="border p-2 hover:bg-24uzr hover:text-white"
                        onMouseEnter={onMouseEnter(plan)}
                        onMouseLeave={onMouseLeave(plan)}
                    >
                        <Link href={`/map/${map.id}/plan/${plan.id}`}>
                            {plan.name}
                        </Link>
                    </div>
                ))}
            </div>
        </>)}
        {activeShip && startBuoy && (
            <NewPlanTool
                map={map}
                ship={activeShip}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default PlanOptions
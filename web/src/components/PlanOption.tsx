"use client"

import { IApiMapOutput, IApiPlanOutput, IApiShipOutput } from "@/types/api"
import Link from "next/link"
import { plural, seconds2hours } from "tslib"
import { fmtHumanDateTime } from 'tslib';

type PlanOptionProps = {
    rootPage: string
    plan: IApiPlanOutput
    onHoverPlan?: (plan?: IApiPlanOutput) => void
}
const PlanOption = (props: PlanOptionProps) => {
    const {
        rootPage,
        plan,
        onHoverPlan,
    } = props

    const onMouseEnter = (plan: IApiPlanOutput) => () => onHoverPlan && onHoverPlan(plan)
    const onMouseLeave = (plan: IApiPlanOutput) => () => onHoverPlan && onHoverPlan()
    return (<>
        <Link href={`${rootPage}/plan/${plan.id}`}>
            <div
                key={plan.id}
                className="flex flex-col border p-2 hover:bg-24uzr hover:text-white"
                onMouseEnter={onMouseEnter(plan)}
                onMouseLeave={onMouseLeave(plan)}
            >
                <div className="text-md">
                    {plan.name}
                </div>
                <div className="flex text-sm gap-2">
                    <div>
                        {fmtHumanDateTime(plan.startTime)}
                    </div>
                    <div>
                        {(
                                (hours: number) => (plural(`${hours} hour`, `${hours} hours`)(hours))
                        )(seconds2hours(plan.raceSecondsRemaining))}
                    </div>
                </div>
            </div>
        </Link>
    </>)
}

export default PlanOption
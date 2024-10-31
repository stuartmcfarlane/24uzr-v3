"use client"

import { IApiPlanOutput } from "@/types/api"
import Link from "next/link"
import { plural, seconds2hours } from "tslib"
import { fmtHumanDateTime } from 'tslib';
import TrashCanIcon from "./Icons/TrashCanIcon";
import { deletePlan } from "@/actions/plan";
import { MouseEvent } from "react";

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

    const onDeletePlan = (plan: IApiPlanOutput) => async (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        await deletePlan(plan.id)
    }
    return (<>
        <Link href={`${rootPage}/plan/${plan.id}`}>
            <div
                key={plan.id}
                className="flex flex-col border p-2 hover:bg-24uzr hover:text-white"
                onMouseEnter={onMouseEnter(plan)}
                onMouseLeave={onMouseLeave(plan)}
            >
                <div className="flex justify-between" onClick={onDeletePlan(plan)}>
                    <div className="text-md">
                        {plan.name}
                    </div>
                    <div className="w-5 text-24uzr-red">
                        <TrashCanIcon />
                    </div>
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
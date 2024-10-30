import { IApiPlanOutput, IApiShipOutput } from "@/types/api"
import { timestamp2epoch, addSeconds, now, CmpFunction, hours2seconds } from "tslib";

export const OLD_PLAN_AGE_HOURS = -24

export const planHasShip = (ship?: IApiShipOutput) => (plan: IApiPlanOutput) => !!ship && plan.shipId === ship.id
export const planIsOld = (hoursOld: number = OLD_PLAN_AGE_HOURS) => (plan: IApiPlanOutput) => {
    const oldTimestamp = addSeconds(hours2seconds(-hoursOld))(now())
    return timestamp2epoch(plan.startTime) < timestamp2epoch(oldTimestamp)
}
export const cmpStartTime: CmpFunction<IApiPlanOutput> = (a: IApiPlanOutput, b: IApiPlanOutput) => {
    const aa = timestamp2epoch(a.startTime)
    const bb = timestamp2epoch(b.startTime)
    return aa > bb ? +1 : aa < bb ? -1 : 0
}

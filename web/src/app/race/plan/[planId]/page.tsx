"use server"

import { getSession } from "@/actions/session"
import MapPlanRoutePageClientFunctions from "@/components/MapPlanRoutePageFunctions"
import { cmpRouteLength, plan2longestRoute } from "@/lib/route"
import { apiGetActiveMap, apiGetBuoys, apiGetGeometry, apiGetPlan, apiGetShip, apiGetWind } from "@/services/api"
import { redirect } from "next/navigation"
import { addSeconds, desc, head, hours2seconds, sort } from "tslib"

const MapPlanPage = async ({
    params
}: {
        params: {
            planId: string
        }
}) => {

    const planId = parseInt(params.planId)
    const session = await getSession()
    const map = await apiGetActiveMap(session.apiToken!)
    if (!map) {
        redirect('/')
    }
    const [
        plan,
        buoys,
        geometry,
    ] = await Promise.all([
        apiGetPlan(session.apiToken!, planId),
        apiGetBuoys(session.apiToken!, map.id),
        apiGetGeometry(session.apiToken!, map.id),
    ])
    
    if (!plan) {
        redirect(`/race`)
    }
    const from = addSeconds(hours2seconds(-1))(plan.startTime)
    const until = addSeconds(plan.raceSecondsRemaining + hours2seconds(12))(plan.startTime)
    const [
        ship,
        wind,
    ] = await Promise.all([
        apiGetShip(session.apiToken!, plan.shipId),
        apiGetWind(session.apiToken!, from, until, map),
    ])
    if (!ship) {
        redirect(`/race`)
    }

    const route = plan2longestRoute(plan)
    return (
        <MapPlanRoutePageClientFunctions
            pageRoot="/race"
            ship={ship}
            map={map}
            geometry={geometry}
            wind={wind}
            plan={plan}
            buoys={buoys || []}
            route={route}
        />
    )
}
export default MapPlanPage
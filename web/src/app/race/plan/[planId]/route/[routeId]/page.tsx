"use server"

import { getSession } from "@/actions/session"
import MapPlanRoutePageClientFunctions from "@/components/MapPlanRoutePageFunctions"
import { apiGetActiveMap, apiGetBuoys, apiGetGeometry, apiGetPlan, apiGetRoute, apiGetShip, apiGetWind } from "@/services/api"
import { redirect } from "next/navigation"
import { addSeconds, hours2seconds } from "tslib"

const MapPlanRoutePage = async ({
    params
}: {
        params: {
            planId: string
            routeId: string
        }
}) => {

    const planId = parseInt(params.planId)
    const routeId = parseInt(params.routeId)
    const session = await getSession()
    const map = await apiGetActiveMap(session.apiToken!)
    if (!map) {
        redirect('/')
    }
    const [
        plan,
        route,
        buoys,
        geometry,
    ] = await Promise.all([
        apiGetPlan(session.apiToken!, planId),
        apiGetRoute(session.apiToken!, routeId),
        apiGetBuoys(session.apiToken!, map.id),
        apiGetGeometry(session.apiToken!, map.id),
    ])
    
    if (!plan) {
        redirect(`/race`)
    }
    if (!route) {
        redirect(`/race/plan/${planId}`)
    }
    const from = addSeconds(hours2seconds(-1))(plan.startTime)
    const until = addSeconds(plan.raceSecondsRemaining + hours2seconds(12))(plan.startTime)
    const [
        wind,
        ship,
    ] = await Promise.all([
        apiGetWind(session.apiToken!, from, until, map),
        apiGetShip(session.apiToken!, plan.shipId),
    ])
    if (!ship) {
        redirect(`/race/plan/${planId}`)
    }
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
export default MapPlanRoutePage
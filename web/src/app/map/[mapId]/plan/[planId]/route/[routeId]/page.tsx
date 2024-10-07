"use server"

import { getSession } from "@/actions/session"
import MapPlanPageClientFunctions from "@/components/MapPlanPageFunctions"
import MapPlanRoutePageClientFunctions from "@/components/MapPlanRoutePageFunctions"
import MapRoutePageClientFunctions from "@/components/MapRoutePageFunctions"
import { useChange } from "@/hooks/useChange"
import usePolling from "@/hooks/usePolling"
import { apiGetBuoys, apiGetLegs, apiGetMap, apiGetPlan, apiGetRoute, apiGetRouteLegs } from "@/services/api"
import { redirect } from "next/navigation"

const MapPlanRoutePage = async ({
    params
}: {
        params: {
            mapId: string,
            planId: string
            routeId: string
        }
}) => {

    console.log(params)
    const mapId = parseInt(params.mapId)
    const planId = parseInt(params.planId)
    const routeId = parseInt(params.routeId)
    const session = await getSession()
    const [
        map,
        plan,
        route,
        buoys,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, mapId),
        apiGetPlan(session.apiToken!, planId),
        apiGetRoute(session.apiToken!, routeId),
        apiGetBuoys(session.apiToken!, mapId),
    ])
    console.log({plan})
    
    if (!map) {
        redirect('/dashboard')
    }
    if (!plan) {
        redirect(`/map/${mapId}`)
    }
    if (!route) {
        redirect(`/map/${mapId}/plan/${planId}`)
    }

    return (
        <MapPlanRoutePageClientFunctions
            map={map}
            plan={plan}
            buoys={buoys || []}
            route={route}
        />
    )
}
export default MapPlanRoutePage
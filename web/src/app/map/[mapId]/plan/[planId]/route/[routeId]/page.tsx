"use server"

import { getSession } from "@/actions/session"
import MapPlanRoutePageClientFunctions from "@/components/MapPlanRoutePageFunctions"
import { apiGetBuoys, apiGetGeometry, apiGetMap, apiGetPlan, apiGetRoute, apiGetWind } from "@/services/api"
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

    const mapId = parseInt(params.mapId)
    const planId = parseInt(params.planId)
    const routeId = parseInt(params.routeId)
    const session = await getSession()
    const [
        map,
        plan,
        route,
        buoys,
        geometry,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, mapId),
        apiGetPlan(session.apiToken!, planId),
        apiGetRoute(session.apiToken!, routeId),
        apiGetBuoys(session.apiToken!, mapId),
        apiGetGeometry(session.apiToken!, mapId),
    ])
    
    if (!map) {
        redirect('/dashboard')
    }
    if (!plan) {
        redirect(`/map/${mapId}`)
    }
    if (!route) {
        redirect(`/map/${mapId}/plan/${planId}`)
    }
    const wind = await apiGetWind(session.apiToken!, 12, map)

    return (
        <MapPlanRoutePageClientFunctions
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
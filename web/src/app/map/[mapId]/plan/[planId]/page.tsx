"use server"

import { getSession } from "@/actions/session"
import MapPlanPageClientFunctions from "@/components/MapPlanPageFunctions"
import MapRoutePageClientFunctions from "@/components/MapRoutePageFunctions"
import { useChange } from "@/hooks/useChange"
import usePolling from "@/hooks/usePolling"
import { apiGetBuoys, apiGetLegs, apiGetMap, apiGetPlan, apiGetRoute, apiGetRouteLegs } from "@/services/api"
import { redirect } from "next/navigation"

const MapRoutePage = async ({
    params
}: {
        params: {
            mapId: string,
            planId: string
        }
}) => {

    console.log(params)
    const mapId = parseInt(params.mapId)
    const planId = parseInt(params.planId)
    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    const [
        map,
        plan,
        buoys,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, mapId),
        apiGetPlan(session.apiToken!, planId),
        apiGetBuoys(session.apiToken!, mapId),
    ])
    console.log({plan})
    
    if (!map) {
        redirect('/dashboard')
    }
    if (!plan) {
        redirect(`/map/${mapId}`)
    }

    return (
        <MapPlanPageClientFunctions
            map={map}
            plan={plan}
            buoys={buoys || []}
        />
    )
}
export default MapRoutePage
"use server"

import { getSession } from "@/actions/session"
import MapPlanPageClientFunctions from "@/components/MapPlanPageFunctions"
import { apiGetBuoys, apiGetGeometry, apiGetMap, apiGetPlan, apiGetWind } from "@/services/api"
import { redirect } from "next/navigation"

const MapPlanPage = async ({
    params
}: {
        params: {
            mapId: string,
            planId: string
        }
}) => {

    const mapId = parseInt(params.mapId)
    const planId = parseInt(params.planId)
    const session = await getSession()
    const [
        map,
        plan,
        buoys,
        geometry,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, mapId),
        apiGetPlan(session.apiToken!, planId),
        apiGetBuoys(session.apiToken!, mapId),
        apiGetGeometry(session.apiToken!, mapId),
    ])
    
    if (!map) {
        redirect('/dashboard')
    }
    if (!plan) {
        redirect(`/map/${mapId}`)
    }
    const wind = await apiGetWind(session.apiToken!, 12, map)

    return (
        <MapPlanPageClientFunctions
            map={map}
            geometry={geometry}
            wind={wind}
            plan={plan}
            buoys={buoys || []}
        />
    )
}
export default MapPlanPage
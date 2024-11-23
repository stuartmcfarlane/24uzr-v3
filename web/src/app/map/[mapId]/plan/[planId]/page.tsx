"use server"

import { getSession } from "@/actions/session"
import MapPlanPageClientFunctions from "@/components/MapPlanPageFunctions"
import { apiGetBuoys, apiGetGeometry, apiGetMap, apiGetPlan, apiGetShip, apiGetIndexedWind } from "@/services/api"
import { redirect } from "next/navigation"
import { addSeconds, hours2seconds } from "tslib"

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
    const ship = await apiGetShip(session.apiToken!, plan.shipId)
    if (!ship) {
        redirect(`/map/${mapId}`)
    }
    const from = addSeconds(hours2seconds(-1))(plan.startTime)
    const until = addSeconds(plan.raceSecondsRemaining)(plan.startTime)
    const wind = await apiGetIndexedWind(session.apiToken!, from, until, map)

    return (
        <MapPlanPageClientFunctions
            pageRoot={`/map/${mapId}`}
            map={map}
            geometry={geometry}
            wind={wind}
            plan={plan}
            ship={ship}
            buoys={buoys || []}
        />
    )
}
export default MapPlanPage
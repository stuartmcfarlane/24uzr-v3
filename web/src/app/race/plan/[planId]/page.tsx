"use server"

import { getSession } from "@/actions/session"
import MapPlanPageClientFunctions from "@/components/MapPlanPageFunctions"
import { apiGetActiveMap, apiGetBuoys, apiGetGeometry, apiGetPlan, apiGetShip, apiGetWind } from "@/services/api"
import { redirect } from "next/navigation"
import { addSeconds, hours2seconds } from "tslib"

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
    console.log(`map`, map)
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
    console.log(`plan`, plan)
    
    if (!plan) {
        redirect(`/race`)
    }
    const ship = await apiGetShip(session.apiToken!, plan.shipId)
    if (!ship) {
        redirect(`/race`)
    }
    const from = addSeconds(hours2seconds(-1))(plan.startTime)
    const until = addSeconds(plan.raceSecondsRemaining)(plan.startTime)
    const wind = await apiGetWind(session.apiToken!, from, until, map)

    return (
        <MapPlanPageClientFunctions
            pageRoot="/race"
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
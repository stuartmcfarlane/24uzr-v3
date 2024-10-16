"use server"

import { getSession } from "@/actions/session"
import LockedMapPageClientFunctions from "@/components/LockedMapPageFunctions"
import UnlockedMapPageClientFunctions from "@/components/UnlockedMapPageFunctions"
import { apiGetBuoys, apiGetGeometry, apiGetLegs, apiGetMap, apiGetPlans, apiGetRoutes, apiGetWind } from "@/services/api"
import { redirect } from "next/navigation"

const MapPage = async ({
    params
}: {
    params: { mapId: string }
}) => {
    const id = parseInt(params.mapId)
    const session = await getSession()
    const [
        map,
        plans,
        buoys,
        legs,
        geometry,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, id),
        apiGetPlans(session.apiToken!, id),
        apiGetBuoys(session.apiToken!, id),
        apiGetLegs(session.apiToken!, id),
        apiGetGeometry(session.apiToken!, id),
    ])
    if (!map) {
        redirect('/dashboard')
    }
    const wind = await apiGetWind(session.apiToken!, 24, map)

    return (
        map.isLocked
         ? <LockedMapPageClientFunctions
            map={map}
            wind={wind || []}
            buoys={buoys || []}
            legs={legs || []}
            plans={plans || []}
        />
         : <UnlockedMapPageClientFunctions
            map={map}
            buoys={buoys || []}
            legs={legs || []}
            geometry={geometry || []}
        />
    )
}
export default MapPage
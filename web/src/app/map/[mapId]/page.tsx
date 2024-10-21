"use server"

import { getSession } from "@/actions/session"
import LockedMapPageClientFunctions from "@/components/LockedMapPageFunctions"
import UnlockedMapPageClientFunctions from "@/components/UnlockedMapPageFunctions"
import { apiGetBuoys, apiGetGeometry, apiGetLegs, apiGetMap, apiGetPlans, apiGetShipsByOwner, apiGetWind } from "@/services/api"
import { redirect } from "next/navigation"

const MapPage = async ({
    params
}: {
    params: { mapId: string }
}) => {
    const id = parseInt(params.mapId)
    const session = await getSession()
    if (!session.isLoggedIn) redirect('/login')
    
    const [
        map,
        ships,
        plans,
        buoys,
        legs,
        geometry,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, id),
        apiGetShipsByOwner(session.apiToken!, session.userId!),
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
            ships={ships || []}
            wind={wind || []}
            buoys={buoys || []}
            legs={legs || []}
            plans={plans || []}
            geometry={geometry || []}
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
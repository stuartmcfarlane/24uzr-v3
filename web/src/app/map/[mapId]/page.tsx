"use server"

import { getSession } from "@/actions/session"
import LockedMapPageClientFunctions from "@/components/LockedMapPageFunctions"
import UnlockedMapPageClientFunctions from "@/components/UnlockedMapPageFunctions"
import { apiGetBuoys, apiGetLegs, apiGetMap, apiGetRoutes } from "@/services/api"
import { redirect } from "next/navigation"

const MapPage = async ({
    params
}: {
    params: { mapId: string }
}) => {
    const id = parseInt(params.mapId)
    console.log(`map page ${id}`)
    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    const [
        map,
        routes,
        buoys,
        legs,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, id),
        apiGetRoutes(session.apiToken!, id),
        apiGetBuoys(session.apiToken!, id),
        apiGetLegs(session.apiToken!, id),
    ])
    if (!map) {
        redirect('/dashboard')
    }

    return (
        map.isLocked
         ? <LockedMapPageClientFunctions
            map={map}
            buoys={buoys || []}
            legs={legs || []}
            routes={routes || []}
        />
         : <UnlockedMapPageClientFunctions
            map={map}
            buoys={buoys || []}
            legs={legs || []}
        />
    )
}
export default MapPage
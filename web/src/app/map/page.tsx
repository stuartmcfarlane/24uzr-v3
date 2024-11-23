"use server"

import { getSession } from "@/actions/session"
import LockedMapPageClientFunctions from "@/components/LockedMapPageFunctions"
import UnlockedMapPageClientFunctions from "@/components/UnlockedMapPageFunctions"
import { apiGetActiveMap, apiGetBuoys, apiGetGeometry, apiGetLegs, apiGetMap, apiGetPlans, apiGetShipsByOwner, apiGetIndexedWind } from "@/services/api"
import { redirect } from "next/navigation"
import { now } from "tslib"
import { addSeconds, hours2seconds } from 'tslib';

const MapPage = async () => {
    const session = await getSession()
    if (!session.isLoggedIn) redirect('/login')
    
    const map = await apiGetActiveMap(session.apiToken!)
    if (!map) {
        redirect('/dashboard')
    }
    const [
        ships,
        plans,
        buoys,
        legs,
        geometry,
    ] = await Promise.all([
        apiGetShipsByOwner(session.apiToken!, session.userId!),
        apiGetPlans(session.apiToken!, map.id),
        apiGetBuoys(session.apiToken!, map.id),
        apiGetLegs(session.apiToken!, map.id),
        apiGetGeometry(session.apiToken!, map.id),
    ])
    const from = addSeconds(hours2seconds(-1))(now())
    const until = addSeconds(hours2seconds(25))(from)
    const wind = await apiGetIndexedWind(session.apiToken!, from, until, map)

    return (
        map.isLocked
         ? <LockedMapPageClientFunctions
            rootPage={`/map/${map.id}`}
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
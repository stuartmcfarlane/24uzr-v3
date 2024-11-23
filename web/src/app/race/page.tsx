"use server"

import { getSession } from "@/actions/session"
import RacePageClientFunctions from "@/components/RacePageClientFunctions"
import { apiGetActiveMap, apiGetBuoys, apiGetGeometry, apiGetIndexedWind, apiGetLegs, apiGetPlansByOwner, apiGetShipsByOwner, apiGetUser } from "@/services/api"
import { redirect } from "next/navigation"
import { now } from "tslib"
import { addSeconds, hours2seconds } from 'tslib';

const Race = async () => {
    const session = await getSession()

    if (!session.isLoggedIn) redirect('/login')

    const map = await apiGetActiveMap(session.apiToken!)

    if (!map) return <div>Error - No map</div>

    const [
        user,
        ships,
        plans,
        buoys,
        legs,
        geometry,
    ] = await Promise.all([
        apiGetUser(session.apiToken!, session.userId),
        apiGetShipsByOwner(session.apiToken!, session.userId!),
        apiGetPlansByOwner(session.apiToken!, session.userId!),
        apiGetBuoys(session.apiToken!, map.id),
        apiGetLegs(session.apiToken!, map.id),
        apiGetGeometry(session.apiToken!, map.id),
    ])

    const from = addSeconds(hours2seconds(-1))(now())
    const until = addSeconds(hours2seconds(25))(from)
    const wind = await apiGetIndexedWind(session.apiToken!, from, until, map)

    return <RacePageClientFunctions
        user={user!}
        map={map}
        ships={ships || []}
        wind={wind || []}
        buoys={buoys || []}
        legs={legs || []}
        plans={plans || []}
        geometry={geometry || []}
    />
}
export default Race
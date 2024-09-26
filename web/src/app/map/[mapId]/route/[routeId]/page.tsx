"use server"

import { getSession } from "@/actions/session"
import MapRoutePageClientFunctions from "@/components/MapRoutePageFunctions"
import { apiGetBuoys, apiGetLegs, apiGetMap, apiGetRoute } from "@/services/api"
import { redirect } from "next/navigation"

const MapRoutePage = async ({
    params
}: {
        params: {
            mapId: string,
            routeId: string
        }
}) => {
        
    const mapId = parseInt(params.mapId)
    const routeId = parseInt(params.routeId)
    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    const [
        map,
        route,
        buoys,
        legs,
    ] = await Promise.all([
            apiGetMap(session.apiToken!, mapId),
            apiGetRoute(session.apiToken!, routeId),
            apiGetBuoys(session.apiToken!, mapId),
            apiGetLegs(session.apiToken!, mapId),
    ])
    if (!map) {
        redirect('/dashboard')
    }
    if (!route) {
        redirect(`/map/${mapId}`)
    }

    return (
        <MapRoutePageClientFunctions
            map={map}
            route={route}
            buoys={buoys || []}
            legs={legs || []}
        />
    )
}
export default MapRoutePage
"use server"

import { getSession } from "@/actions/session"
import MapRoutePageClientFunctions from "@/components/MapRoutePageFunctions"
import { useChange } from "@/hooks/useChange"
import usePolling from "@/hooks/usePolling"
import { apiGetBuoys, apiGetLegs, apiGetMap, apiGetRoute, apiGetRouteLegs } from "@/services/api"
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
        routeLegs,
    ] = await Promise.all([
        apiGetMap(session.apiToken!, mapId),
        apiGetRoute(session.apiToken!, routeId),
        apiGetBuoys(session.apiToken!, mapId),
        apiGetRouteLegs(session.apiToken!, routeId),
    ])
    console.log({route, routeLegs})
    
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
            routeLegs={routeLegs || []}
        />
    )
}
export default MapRoutePage
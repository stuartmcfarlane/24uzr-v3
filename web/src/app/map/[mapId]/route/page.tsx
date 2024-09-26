"use server"

import { getSession } from "@/actions/session"
import MapRoutePageClientFunctions from "@/components/MapRoutePageFunctions"
import { apiGetBuoys, apiGetLegs, apiGetMap } from "@/services/api"
import { redirect } from "next/navigation"

const MapRoutePage = async ({
    params
}: {
    params: { id: string }
}) => {
        
    const id = parseInt(params.id)
    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    const map = await apiGetMap(session.apiToken!, id)
    if (!map) {
        redirect('/dashboard')
    }
    const buoys = await apiGetBuoys(session.apiToken!, map.id)
    const legs = await apiGetLegs(session.apiToken!, map.id)

    return (
        <MapRoutePageClientFunctions
            map={map}
            buoys={buoys || []}
            legs={legs || []}
        />
    )
}
export default MapRoutePage
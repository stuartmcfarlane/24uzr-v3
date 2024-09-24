"use server"

import { getSession } from "@/actions/session"
import MapPageClientFunctions from "@/components/MapPageFunctions"
import { apiGetBuoys, apiGetLegs, apiGetMap } from "@/services/api"
import { redirect } from "next/navigation"

const MapPage = async ({
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
        <MapPageClientFunctions
            map={map}
            buoys={buoys || []}
            legs={legs || []}
        />
    )
}
export default MapPage
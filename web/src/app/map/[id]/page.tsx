"use server"

import { getSession } from "@/actions/session"
import { apiGetMap } from "@/services/api"

const MapPage = async ({
    params
}: {
    params: { id: string }
    }) => {
        
    const id = parseInt(params.id)
    const session = await getSession()
    const map = await apiGetMap(id, session.apiToken)

    return (
        <div className="">
            Map {map?.name}
        </div>
    )
}
export default MapPage
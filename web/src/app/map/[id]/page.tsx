"use server"

import { getSession } from "@/actions/session"
import { apiGetMap } from "@/services/api"
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

    return (
        <div className="my-10">
            <h1 className="text-2xl">Map {map?.name}</h1>
        </div>
    )
}
export default MapPage
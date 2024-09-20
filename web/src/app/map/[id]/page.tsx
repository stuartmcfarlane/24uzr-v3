"use server"

import { getSession } from "@/actions/session"
import MapCanvas from "@/components/ MapCanvas"
import AddBuoyForm from "@/components/AddBuoyForm"
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
    if (!map) {
        redirect('/dashboard')
    }

    return (
        <div className="flex-grow my-10 flex gap-4">
            <div className="">
                <h1 className="text-2xl">Map {map?.name}</h1>
                <AddBuoyForm map={map} />
            </div>
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas/>
                </div>
            </div>
        </div>
    )
}
export default MapPage
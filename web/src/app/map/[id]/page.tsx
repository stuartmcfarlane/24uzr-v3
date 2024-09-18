"use server"

import { getMap } from "@/services/api"
import { cookies } from "next/headers"

const MapPage = async ({
    params
}: {
    params: { id: string }
}) => {
    const map = await getMap(parseInt(params.id), cookies().get('access_token')?.value)
    console.log(`MapPage ${params.id}`, map)
    console.log(`MapPage ${params.id} cookies`, cookies().getAll())
    return (
        <div className="">
            Map {map?.name}
        </div>
    )
}
export default MapPage
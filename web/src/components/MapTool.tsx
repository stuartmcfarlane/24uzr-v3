"use server"

import { apiGetMaps} from "@/services/api"
import { IApiMap } from "@/types/user"
import Link from "next/link"
import { NewMapTool } from "./NewMapTool"
import { getSession } from "@/actions"


export const MapTool = async () => {

    const session = await getSession()
    const maps = await apiGetMaps(session.apiToken)
    return (
        <div className="grid-cols-1 gap-4 bg-slate-50 p-5">
            <h2 className="">Maps</h2>
            {maps.map((map: IApiMap) => (
                <div key={map.id} >
                    <Link href={`/map/${map.id}`}className="">{map.name}</Link>
                </div>
            ))}
            <div>
                <NewMapTool />
            </div>
        </div>
    )
}
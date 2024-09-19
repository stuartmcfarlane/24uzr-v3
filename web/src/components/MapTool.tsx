"use server"

import { getMaps } from "@/services/api"
import { IApiMap } from "@/types/user"
import Link from "next/link"
import { NewMapTool } from "./NewMapTool"
import { cookies } from "next/headers"


export const MapTool = async () => {

    const maps = await getMaps(cookies().get('access_token')?.value)
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
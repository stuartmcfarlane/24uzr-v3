
import { getMaps } from "@/services/api"
import { IMap } from "@/types/user"
import Link from "next/link"
import { NewMapTool } from "./NewMapTool"


export const MapTool = async () => {

    const maps = await getMaps()
    return (
        <div className="grid-cols-1 gap-4 bg-slate-50 p-5">
            <h2 className="">Maps</h2>
            {maps.map((map: IMap) => (
                <div key={map.id} className="">{map.name}</div>
            ))}
            <div>
                <NewMapTool />
            </div>
        </div>
    )
}
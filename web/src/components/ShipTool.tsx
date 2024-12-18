"use server"

import Link from "next/link"
import { getSession } from "@/actions/session"
import { apiGetShips, apiGetUsers } from "@/services/api"
import { NewShipTool } from "./NewShipTool"


export const ShipTool = async () => {

    const session = await getSession()
    const ships = await apiGetShips(session.apiToken!)
    const users = await apiGetUsers(session.apiToken!)
    return (
        <div className="bg-slate-50 p-5">
            <h2 className="text-xl border-b-2 pb-2">Ships</h2>
            {(ships || []).map((ship) => (
                <div key={ship.id} className="my-2">
                    <Link href={`/ship/${ship.id}`}className="">{ship.name}</Link>
                </div>
            ))}
            <NewShipTool users={users || []} />
        </div>
    )
}
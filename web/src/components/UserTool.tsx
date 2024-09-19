"use server"

import { apiGetUsers} from "@/services/api"
import Link from "next/link"
import { getSession } from "@/actions/session"


export const UserTool = async () => {

    const session = await getSession()
    const users = await apiGetUsers(session.apiToken!)
    return (
        <div className="grid-cols-1 gap-4 bg-slate-50 p-5">
            <h2 className="t">Users</h2>
            {(users || []).map((user) => (
                <div key={user.id} className="my-2">
                    <Link href={`/user/${user.id}`}className="">{user.name}</Link>
                </div>
            ))}
        </div>
    )
}
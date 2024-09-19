"use server"

import { getSession } from "@/actions/session"
import UserDetails from "@/components/UserDetails"
import { apiGetUser } from "@/services/api"
import { redirect } from "next/navigation"

const UserPage = async ({
    params
}: {
    params: { id: string }
}) => {
        
    const id = parseInt(params.id)
    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    const user = await apiGetUser(session.apiToken!, id)

    return (
        <div className="my-10">
            <h1 className="text-2xl">User {user?.name}</h1>
            <UserDetails user={user}/>
        </div>
    )
}
export default UserPage
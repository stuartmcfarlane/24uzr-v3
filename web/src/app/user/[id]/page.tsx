"use server"

import { getSession } from "@/actions/session"
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
        <div className="">
            User {user?.name}
        </div>
    )
}
export default UserPage
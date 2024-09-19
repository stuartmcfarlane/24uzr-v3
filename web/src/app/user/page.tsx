import { getSession } from "@/actions/session"
import { apiGetUsers } from "@/services/api"
import { redirect } from "next/navigation"

const UserPage = async () => {

    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    const users = await apiGetUsers(session.apiToken!)
    return (
        <div className="">
            <h1>Users page</h1>
            <p> There are {(users || []).length} users</p>
        </div>
    )
}

export default UserPage
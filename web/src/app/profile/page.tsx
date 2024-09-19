
import { getSession } from "@/actions/session"
import UserDetails from "@/components/UserDetails"
import { apiGetUser } from "@/services/api"
import { redirect } from "next/navigation"

const ProfilePage = async () => {

    const session = await getSession()

    if (!session.isLoggedIn) {
        redirect('/')
    }

    const user = await apiGetUser(session.apiToken!)

    return (
        <div className="my-10">
            <h1 className="text-center md:text-left text-2xl">Profile</h1>
            <UserDetails user={user}/>
        </div>
    )
}
export default ProfilePage
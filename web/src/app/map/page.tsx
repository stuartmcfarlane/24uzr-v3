import { getSession } from "@/actions/session"
import { redirect } from "next/navigation"

const MapPage = async () => {

    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    return (
        <div className="">
            Map page
        </div>
    )
}

export default MapPage
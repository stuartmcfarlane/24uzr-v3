import { getSession } from "@/actions/session"
import { MapTool } from "@/components/MapTool"
import { UserTool } from "@/components/UserTool"

const DashboardPage = async () => {
    const session = await getSession()

    return (
        <div className="">
            Dashboard page
            {session.isAdmin && (
                <div className="grid grid-cols-2 md:grid-cols-6">
                    <MapTool />
                    <UserTool />
                </div>
            )}
        </div>
    )
}

export default DashboardPage
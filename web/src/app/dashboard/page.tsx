import { getSession } from "@/actions/session"
import { MapTool } from "@/components/MapTool"
import { UserTool } from "@/components/UserTool"

const DashboardPage = async () => {
    const session = await getSession()

    return (
        <div className="my-10">
            <h1 className="text-2xl">Dashboard page</h1>
            {session.isAdmin && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <MapTool/>
                    <UserTool/>
                </div>
            )}
        </div>
    )
}

export default DashboardPage
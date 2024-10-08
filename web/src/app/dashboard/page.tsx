import { getSession } from "@/actions/session"
import { MapTool } from "@/components/MapTool"
import { UserTool } from "@/components/UserTool"
import { WindTool } from "@/components/WindTool"

const DashboardPage = async () => {
    const session = await getSession()

    return (
        <div className="my-8">
            <h1 className="text-2xl">Dashboard page</h1>
            {session.isAdmin && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <MapTool/>
                    <WindTool/>
                    <UserTool/>
                </div>
            )}
        </div>
    )
}

export default DashboardPage
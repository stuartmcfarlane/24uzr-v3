import { MapTool } from "@/components/MapTool"

const DashboardPage = () => {
    return (
        <div className="">
            Dashboard page
            <div className="grid grid-cols-1 md:grid-cols-6">
                <MapTool />
            </div>
        </div>
    )
}

export default DashboardPage
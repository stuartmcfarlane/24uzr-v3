import { getSession } from "@/actions/session"
import { ShipPolarTool } from "@/components/ShipPolarTool"
import { apiGetShip } from "@/services/api"
import { redirect } from "next/navigation"

const ShipPage = async ({
    params
}: {
    params: { shipId: string }
}) => {
    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    const id = parseInt(params.shipId)
    const ship = await apiGetShip(session.apiToken!, id)
    console.log(`ship`, ship)
    return (
        <div className="my-8">
            <h1 className="text-2xl">
                {ship ? ship.name : 'Ship not found'}
            </h1>
            {ship && (
                <ShipPolarTool ship={ship} />
            )}
        </div>
    )
}
export default ShipPage
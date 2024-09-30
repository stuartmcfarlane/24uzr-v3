import { redirect } from "next/navigation"

const MapPlanPage = async ({
    params
}: {
    params: { mapId: string }
}) => {

    redirect(`/map/${params.mapId}`)
}
export default MapPlanPage
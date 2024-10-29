import { redirect } from "next/navigation"

const MapPlanPage = async ({
    params
}: {
    params: { mapId: string }
}) => {

    redirect(`/race`)
}
export default MapPlanPage
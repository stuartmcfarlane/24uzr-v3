import { redirect } from "next/navigation"

const MapPlanPage = async ({
    params
}: {
        params: {
            mapId: string,
            planId: string,
        }
}) => {

    redirect(`/map/${params.mapId}/plan/${params.planId}`)
}
export default MapPlanPage
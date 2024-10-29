import { redirect } from "next/navigation"

const MapPlanPage = async ({
    params
}: {
        params: {
            mapId: string,
            planId: string,
        }
}) => {

    redirect(`/race/plan/${params.planId}`)
}
export default MapPlanPage
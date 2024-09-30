import { redirect } from "next/navigation"

const MapPlanPage = async ({
    params
}: {
    params: { id: string }
}) => {

    redirect(`/map/${params.id}`)
}
export default MapPlanPage
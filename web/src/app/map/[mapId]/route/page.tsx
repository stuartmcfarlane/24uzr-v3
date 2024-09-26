import { redirect } from "next/navigation"

const MapRoutePage = async ({
    params
}: {
    params: { id: string }
}) => {

    redirect(`/map/${params.id}`)
}
export default MapRoutePage
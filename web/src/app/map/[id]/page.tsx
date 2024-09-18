import { getMap } from "@/services/api"

const MapPage = async ({
    params
}: {
    params: { id: string }
}) => {
    const map = await getMap(parseInt(params.id))
    console.log(`MapPage ${params.id}`, map)
    return (
        <div className="">
            Map {map?.name}
        </div>
    )
}
export default MapPage
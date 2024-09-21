
import { getSession } from "@/actions/session"
import { apiGetBuoys } from "@/services/api"
import { IApiMapOutput } from "@/types/api"
import MapSvg from "./MapCanvas/MapSvg"

type MapCanvasProps = {
    map: IApiMapOutput
}

const MapCanvas = async (props: MapCanvasProps) => {
    const { map } = props
    const session = await getSession()
    const buoys = (await apiGetBuoys(session.apiToken!, map.id)) || []

    return <MapSvg buoys={buoys} />
}

export default MapCanvas
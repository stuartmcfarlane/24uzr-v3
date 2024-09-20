import { getSession } from "@/actions/session"
import { apiGetBuoys } from "@/services/api"
import { IApiMapOutput } from "@/types/api"
import MapBuoy from "./MapCanvas/MapBuoy"
import { growRect, latLng2canvas, points2boundingRect, rect2viewBox } from "@/lib/graph"

type MapCanvasProps = {
    map: IApiMapOutput
}

const MapCanvas = async (props: MapCanvasProps) => {
    const { map } = props
    const session = await getSession()
    const buoys = (await apiGetBuoys(session.apiToken!, map.id)) || []
    console.log('buoys', buoys)
    const viewBoxRect = growRect(
        "10%",
        points2boundingRect(
            buoys.map(latLng2canvas)
        )
    )
    const viewBox = rect2viewBox(viewBoxRect)
    return (
        <svg className="w-full h-full" viewBox={viewBox}>
            {(buoys || []).map(buoy => <MapBuoy key={buoy.id} buoy={buoy} viewBoxRect={viewBoxRect} />)}
        </svg>
    )
}

export default MapCanvas
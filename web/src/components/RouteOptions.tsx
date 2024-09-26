import { IApiBuoyOutput, IApiMapOutput, IApiRouteOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"


type RouteOptionsProps = {
    map: IApiMapOutput
    routes: IApiRouteOutput[]
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
}
const RouteOptions = (props: RouteOptionsProps) => {
    const {
        map,
        routes,
        startBuoy,
        endBuoy,
    } = props

    return (<>
        {!startBuoy && (
            <div className="flex flex-col gap-4 flex-grow">
                {(routes || []).map(route => (
                    <div key={route.id} className="">
                        <Link href={`/map/${map.id}/route/${route.id}`}>
                            {route.name}
                        </Link>
                    </div>
                ))}
            </div>
        )}
        {startBuoy && (
            <NewRouteTool
                map={map}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default RouteOptions
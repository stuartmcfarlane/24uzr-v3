import { IApiBuoyOutput, IApiMapOutput, IApiRouteOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"
import RouteIcon from "./Icons/RouteIcon"


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

    console.log('startBuoy', startBuoy)
    return (<>
        {!startBuoy && (<>
            <div className="flex gap-4">
                <div className="w-7">
                    <RouteIcon/>
                </div>
                <div className="">
                    Routes
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {(routes || []).map(route => (
                    <div key={route.id} className="ml-11">
                        <Link href={`/map/${map.id}/route/${route.id}`}>
                            {route.name}
                        </Link>
                    </div>
                ))}
            </div>
        </>)}
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
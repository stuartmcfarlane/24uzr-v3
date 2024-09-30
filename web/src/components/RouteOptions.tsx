import { IApiBuoyOutput, IApiMapOutput, IApiRouteOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"
import RouteIcon from "./Icons/RouteIcon"
import { MouseEvent } from "react"


type RouteOptionsProps = {
    map: IApiMapOutput
    routes: IApiRouteOutput[]
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
}
const RouteOptions = (props: RouteOptionsProps) => {
    const {
        map,
        routes,
        startBuoy,
        endBuoy,
        onHoverRoute,
    } = props

    const onMouseEnter = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute(route)
    const onMouseLeave = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute()

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
                    <div
                        key={route.id}
                        className="border p-4 hover:bg-24uzr hover:text-white"
                        onMouseEnter={onMouseEnter(route)}
                        onMouseLeave={onMouseLeave(route)}
                    >
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
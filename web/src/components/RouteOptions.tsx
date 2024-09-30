import { IApiBuoyOutput, IApiMapOutput, IApiPlanOutput, IApiRouteOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"
import RouteIcon from "./Icons/RouteIcon"
import { MouseEvent } from "react"


type RouteOptionsProps = {
    plan: IApiPlanOutput
    routes: IApiRouteOutput[]
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    selectedRoute?: IApiRouteOutput
}
const RouteOptions = (props: RouteOptionsProps) => {
    const {
        plan,
        routes,
        startBuoy,
        endBuoy,
        onHoverRoute,
        selectedRoute
    } = props

    console.log(`RouteOptions`, plan, routes)
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
                        className={`border p-4 hover:bg-24uzr hover:text-white ${(
                            selectedRoute?.id === route.id
                                ? '4 bg-24uzr text-white'
                                : ''

                        )}`}
                        onMouseEnter={onMouseEnter(route)}
                        onMouseLeave={onMouseLeave(route)}
                    >
                        <Link href={`/map/${plan.mapId}/plan/${plan.id}/route/${route.id}`}>
                            {route.name}
                        </Link>
                    </div>
                ))}
            </div>
        </>)}
        {startBuoy && (
            <NewRouteTool
                plan={plan}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default RouteOptions
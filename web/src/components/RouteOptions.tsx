import { IApiBuoyOutput, IApiMapOutput, IApiPlanOutput, IApiRouteOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"
import RouteIcon from "./Icons/RouteIcon"
import { MouseEvent } from "react"
import { fmtNM, route2LengthNm } from "@/lib/route"


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
            <div className="flex flex-col gap-4 overflow-y-auto pr-4">
                {(routes || []).map(route => (
                    <div
                        key={route.id}
                        className={`flex justify-between border p-2 hover:bg-24uzr hover:text-white ${(
                            selectedRoute?.id === route.id
                                ? ' bg-24uzr text-white'
                                : ''

                        )}`}
                        onMouseEnter={onMouseEnter(route)}
                        onMouseLeave={onMouseLeave(route)}
                    >
                        <Link className="flex-grow flex flex-col"
                            href={`/map/${plan.mapId}/plan/${plan.id}/route/${route.id}`}
                        >
                            <div className="">
                                {route.name}
                            </div>
                            <div className="text-xs">
                                {fmtNM(route2LengthNm(route))}
                            </div>
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
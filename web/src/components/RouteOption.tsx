import { IApiPlanOutput, IApiRouteOutput } from "@/types/api"
import Link from "next/link"
import { cmpRouteLegOrder, fmtNM, route2LengthNm } from "@/lib/route"
import { sort } from "tslib"


type RouteOptionProps = {
    plan: IApiPlanOutput
    route: IApiRouteOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    selectedRoute?: IApiRouteOutput
    showBuoys?: boolean
}
const RouteOption = (props: RouteOptionProps) => {
    const {
        plan,
        route,
        onHoverRoute,
        selectedRoute,
        showBuoys,
    } = props

    const onMouseEnter = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute(route)
    const onMouseLeave = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute()

    return (<>
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
            <Link className="flex flex-col"
                href={`/map/${plan.mapId}/plan/${plan.id}/route/${route.id}`}
            >
                <div className="">
                    {route.name}
                </div>
                <div className="text-xs">
                    {fmtNM(route2LengthNm(route))}
                </div>
                {showBuoys && (
                    <div className="flex-col gap-2">
                        {sort(cmpRouteLegOrder)(route.legs).map(routeLeg => (
                            <div
                                key={`${routeLeg.leg.id}:${routeLeg.leg.startBuoy.id}`}
                                className="
                                    bg-blue-100
                                    text-blue-800
                                    text-xs
                                    font-medium
                                    me-2
                                    px-2.5
                                    py-0.5
                                    rounded
                                    dark:bg-gray-700
                                    dark:text-blue-400
                                    border
                                    border-blue-400
                                "
                            >
                                {routeLeg.leg.startBuoy.name}
                            </div>
                        ))}
                        <div
                            className="
                                bg-blue-100
                                text-blue-800
                                text-xs
                                font-medium
                                me-2
                                px-2.5
                                py-0.5
                                rounded
                                dark:bg-gray-700
                                dark:text-blue-400
                                border
                                border-blue-400
                            "
                        >
                            {route.endBuoy.name}
                        </div>
                    </div>
                )}
            </Link>
        </div>
    </>)
}

export default RouteOption
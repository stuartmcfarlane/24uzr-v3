import { IApiBuoyOutput, IApiPlanOutput, IApiRouteOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"
import RouteIcon from "./Icons/RouteIcon"
import { fmtNM, route2LengthNm } from "@/lib/route"
import { useCallback, useState } from "react"
import usePolling from "@/hooks/usePolling"
import { useChange } from "@/hooks/useChange"
import { getPlan } from "@/actions/plan"


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

    const [actualPlan, setActualPlan] = useState(plan)
    const [actualRoutes, setActualRoutes] = useState(routes)
    const onMouseEnter = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute(route)
    const onMouseLeave = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute()

    const poll = useCallback(async () => {
            const plan = await getPlan(actualPlan.id)
            return plan
        }, [])
    const {data: polledPlan, cancel: cancelPolling} = usePolling(
        poll, {
            interval: 1000,
        }
    )
    useChange(
        () => {
            if (!polledPlan) return
            if (polledPlan.status !== 'PENDING') {
                cancelPolling()
                setActualPlan(polledPlan)
                setActualRoutes(polledPlan.routes)
            }
        },
        [polledPlan?.status]
    )
    if (polledPlan?.status === 'DONE') cancelPolling()
    return (<>
        {!startBuoy && (<>
            <div className="flex gap-4">
                <div className="w-7">
                    <RouteIcon/>
                </div>
                <div className="">
                    Routes
                </div>
                {actualPlan.status === 'PENDING' && (
                    <div>pending</div>
                )}
                {actualPlan.status === 'FAILED' && (
                    <div>failed</div>
                )}
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto pr-4">
                {(actualRoutes || []).map(route => (
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
                            href={`/map/${actualPlan.mapId}/plan/${actualPlan.id}/route/${route.id}`}
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
                plan={actualPlan}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default RouteOptions
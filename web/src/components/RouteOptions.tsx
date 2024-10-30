import { IApiBuoyOutput, IApiPlanOutput, IApiRouteLegOutput, IApiRouteOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"
import RouteIcon from "./Icons/RouteIcon"
import { cmpRouteLegOrder, cmpRouteLength, fmtNM, route2LengthNm } from "@/lib/route"
import { useCallback, useState } from "react"
import usePolling from "@/hooks/usePolling"
import { useChange } from "@/hooks/useChange"
import { getPlan } from "@/actions/plan"
import { desc, IndexedWind, ShipPolar, sort, Timestamp } from "tslib"
import RouteOption from "./RouteOption"


type RouteOptionsProps = {
    pageRoot: string
    shipPolar: ShipPolar
    wind: IndexedWind[]
    plan: IApiPlanOutput
    routes: IApiRouteOutput[]
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    onHoverLeg?: (leg?: IApiRouteLegOutput) => void
    selectedRoute?: IApiRouteOutput
    selectedLeg?: IApiRouteLegOutput
    hoveredLeg?: IApiRouteLegOutput
    showBuoys?: boolean
    selectedWindTimestamp?: Timestamp
}
const RouteOptions = (props: RouteOptionsProps) => {
    const {
        pageRoot,
        shipPolar,
        wind,
        plan,
        routes,
        startBuoy,
        endBuoy,
        onHoverRoute,
        onHoverLeg,
        selectedRoute,
        selectedLeg,
        hoveredLeg,
        showBuoys,
        selectedWindTimestamp,
    } = props

    const [actualPlan, setActualPlan] = useState(plan)
    const [actualRoutes, setActualRoutes] = useState(routes)
    const onMouseEnter = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute(route)
    const onMouseLeave = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute()

    const poll = useCallback(
        async () => {
            const plan = await getPlan(actualPlan.id)
            return plan
        }, []
    )
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
                {selectedRoute && (
                    <RouteOption
                        pageRoot={pageRoot}
                        shipPolar={shipPolar}
                        wind={wind}
                        selectedWindTimestamp={selectedWindTimestamp}
                        plan={actualPlan}
                        route={selectedRoute}
                        onHoverRoute={onHoverRoute}
                        onHoverLeg={onHoverLeg}
                        selectedRoute={selectedRoute}
                        selectedLeg={selectedLeg}
                        hoveredLeg={hoveredLeg}
                        showBuoys={true}
                    />
                )}
                {sort(desc(cmpRouteLength))(actualRoutes || []).map(route => (
                    (!selectedRoute || route.id !== selectedRoute.id) && (
                        <RouteOption key={route.id}
                            pageRoot={pageRoot}
                            shipPolar={shipPolar}
                            wind={wind}
                            selectedWindTimestamp={selectedWindTimestamp}
                            plan={actualPlan}
                            route={route}
                            onHoverRoute={onHoverRoute}
                            selectedRoute={selectedRoute}
                            showBuoys={showBuoys}
                        />
                    )
                ))}
            </div>
        </>)}
        {startBuoy && (
            <NewRouteTool
                pageRoot={pageRoot}
                plan={actualPlan}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default RouteOptions
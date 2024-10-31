import { IApiBuoyOutput, IApiPlanOutput, IApiRouteLegOutput, IApiRouteOutput } from "@/types/api"
import Link from "next/link"
import { NewRouteTool } from "./NewRouteTool"
import RouteIcon from "./Icons/RouteIcon"
import { cmpRouteLegOrder, cmpRouteLength, FleshedRoute, FleshedRouteLeg, fleshenRoute, fmtNM, isFleshedRoute, plan2longestRoute, route2LengthNm } from "@/lib/route"
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
    routes: FleshedRoute[]
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    onHoverRouteLeg?: (leg?: FleshedRouteLeg) => void
    onSelectRouteLeg?: (leg?: FleshedRouteLeg) => void
    selectedRoute?: FleshedRoute
    selectedRouteLeg?: FleshedRouteLeg
    hoveredRouteLeg?: FleshedRouteLeg
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
        onHoverRouteLeg,
        onSelectRouteLeg,
        selectedRoute,
        selectedRouteLeg,
        hoveredRouteLeg,
        showBuoys,
        selectedWindTimestamp,
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
                {plan.status === 'PENDING' && (
                    <div>pending</div>
                )}
                {plan.status === 'FAILED' && (
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
                        plan={plan}
                        route={selectedRoute}
                        onHoverRoute={onHoverRoute}
                        onHoverRouteLeg={onHoverRouteLeg}
                        onSelectRouteLeg={onSelectRouteLeg}
                        selectedRoute={selectedRoute}
                        selectedRouteLeg={selectedRouteLeg}
                        hoveredRouteLeg={hoveredRouteLeg}
                        showBuoys={true}
                    />
                )}
                {sort(desc(cmpRouteLength))(routes || []).filter(isFleshedRoute).map(route => (
                    (!selectedRoute || route.id !== selectedRoute.id) && (
                        <RouteOption key={route.id}
                            pageRoot={pageRoot}
                            shipPolar={shipPolar}
                            wind={wind}
                            selectedWindTimestamp={selectedWindTimestamp}
                            plan={plan}
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
                plan={plan}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default RouteOptions
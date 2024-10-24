import { IApiBuoyOutput, IApiPlanOutput, IApiRouteLegOutput, IApiRouteOutput } from "@/types/api"
import Link from "next/link"
import { cmpRouteLegOrder, FleshedRouteBuoy, FleshedRouteLeg, fleshenRoute, fmtNM, route2LengthNm } from "@/lib/route"
import { fmtDegrees, fmtHoursMinutes, fmtHumanTime, fmtKnots, fmtWindSpeed, LatLng, metersPerSecond2knots, ShipPolar, sort, Timestamp, Vector, vectorAngle, vectorMagnitude, windAtLocation, WindIndicatorMode } from "tslib"
import { IndexedWind, windAtTimeAndLocation } from '../../../tslib/src/wind';
import { radians2degrees } from '../../../tslib/src/conversions';
import { useState } from "react";
import { useChange } from "@/hooks/useChange";
import { redirect } from "next/navigation";
import { FleshedRoute } from '../lib/route';


type RouteOptionProps = {
    shipPolar: ShipPolar
    wind: IndexedWind[]
    plan: IApiPlanOutput
    route: IApiRouteOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    selectedRoute?: IApiRouteOutput
    showBuoys?: boolean
    windTime: number
}
const RouteOption = (props: RouteOptionProps) => {
    const {
        shipPolar,
        wind,
        windTime,
        plan,
        route,
        onHoverRoute,
        selectedRoute,
        showBuoys,
    } = props

    if (selectedRoute?.id === route.id) return (
        <SelectedRoute
            shipPolar={shipPolar}
            wind={wind}
            windTime={windTime}
            plan={plan}
            route={route}
            onHoverRoute={onHoverRoute}
            selectedRoute={selectedRoute}
            showBuoys={showBuoys}
        />
    )
    return <AlternateRoute
        plan={plan}
        route={route}
        onHoverRoute={onHoverRoute}
        selectedRoute={selectedRoute}
    />
}

export default RouteOption

const AlternateRoute = (props: {
    route: IApiRouteOutput
    plan: IApiPlanOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    selectedRoute?: IApiRouteOutput
}) => {
    const {
        route,
        plan,
        onHoverRoute,
        selectedRoute,
    } = props

    const onMouseEnter = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute(route)
    const onMouseLeave = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute()

    return (
        <div
            key={route.id}
            className="flex justify-between border p-2 hover:bg-24uzr hover:text-white"
            onMouseEnter={onMouseEnter(route)}
            onMouseLeave={onMouseLeave(route)}
        >
            <Link className="flex flex-col"
                href={`/map/${plan.mapId}/plan/${plan.id}/route/${route.id}`}
            >
                <div className="flex flex-row content-start gap-4">
                    <div className="">
                        {route.name}
                    </div>
                    <div className="text-xs">
                        {fmtNM(route2LengthNm(route))}
                    </div>
                </div>
            </Link>
        </div>
    )
}

const SelectedRoute = (props: {
    shipPolar: ShipPolar
    wind: IndexedWind[]
    windTime: number
    route: IApiRouteOutput
    plan: IApiPlanOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    selectedRoute?: IApiRouteOutput
    showBuoys?: boolean
}) => {
    const {
        shipPolar,
        wind,
        windTime,
        route,
        plan,
        onHoverRoute,
        selectedRoute,
        showBuoys,
    } = props

    const [fleshedRoute, setFleshedRoute] = useState(fleshenRoute(shipPolar, wind, plan, route))
    
    const onMouseEnter = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute(route)
    const onMouseLeave = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute()

    useChange(
        () => {
            const fleshedRoute = fleshenRoute(shipPolar, wind, plan, route)
            setFleshedRoute(fleshedRoute)
        },
        [route]
    )

    if (!fleshedRoute) {
        return <div>Error, old plan</div>
    }
    
    return (
        <div
            key={route.id}
            className="
                flex
                justify-between
                border
                p-2
                hover:bg-24uzr
                hover:text-white
                bg-24uzr
                text-white
            "
            onMouseEnter={onMouseEnter(route)}
            onMouseLeave={onMouseLeave(route)}
        >
            <Link className="flex flex-col"
                href={`/map/${plan.mapId}/plan/${plan.id}/route/${route.id}`}
            >
                <div className="flex flex-row content-start gap-4">
                    <div className="flex flex-col">
                        <div className="">
                            {route.name}
                        </div>
                        <div className="">
                            {fmtHumanTime(plan.startTime)}
                        </div>
                    </div>
                    {fleshedRoute && (
                        <div className="text-xs">
                            {fmtNM(fleshedRoute.distance)}
                        </div>
                    )}
                </div>
                {showBuoys && (
                    <div className="flex-col gap-2">
                        {sort(cmpRouteLegOrder)(fleshedRoute.legs).map(routeLeg => (
                            <RouteBuoy
                                wind={wind}
                                key={routeLeg.leg.id}
                                plan={plan}
                                route={route}
                                routeLeg={routeLeg}
                                buoy={routeLeg.startBuoy}
                                windTime={windTime}
                            />
                        ))}
                        <RouteBuoy
                            wind={wind}
                            plan={plan}
                            route={route}
                            buoy={fleshedRoute.endBuoy}
                        />
                    </div>
                )}
            </Link>
        </div>
    )
}

const RouteBuoy = (props:
    {
        wind: IndexedWind[]
        windTime?: number
        plan: IApiPlanOutput
        route: IApiRouteOutput
        buoy: FleshedRouteBuoy
        routeLeg?: FleshedRouteLeg
    }
) => {
    const {
        wind,
        windTime,
        plan,
        route,
        routeLeg,
        buoy,
    } = props

    const boatSpeed = routeLeg?.boatSpeed
    const bearing = routeLeg?.bearing
    const vWind=windAtTimeAndLocation(wind, buoy.timestamp, buoy)
    
    return (
        <div
            className="
                flex
                justify-between
                gap-4 
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
            <div>
                {buoy.name}
            </div>
            {windTime !== undefined && (
                <div className="flex flex-row gap-2">
                    <WindIndicator
                        timestamp={buoy.timestamp}
                        vWind={vWind}
                    />
                    <BoatIndicator
                        vWind={vWind}
                        boatSpeed={boatSpeed}
                        bearing={bearing}
                    />
                </div>
            )}
        </div>
    )
}

const WindIndicator = (props: {
    vWind: Vector
    timestamp: Timestamp
    mode?: WindIndicatorMode
}) => {
    const {
        timestamp,
        vWind,
        mode = 'text',
    } = props
    if (mode === 'text') return (
        <>
            <div>{fmtHoursMinutes(timestamp)}</div>
            <div>{fmtDegrees(radians2degrees(vectorAngle(vWind)))}</div>
            <div>{fmtWindSpeed(metersPerSecond2knots(vectorMagnitude(vWind)))}</div>
        </>
    )
    return <></>
}

const BoatIndicator = (props: {
    vWind: Vector
    boatSpeed?: number
    bearing?: number
    mode?: WindIndicatorMode
}) => {
    const {
        vWind,
        boatSpeed,
        bearing,
        mode = 'text',
    } = props
    if (undefined === bearing || undefined === boatSpeed) return <></>
    const twa = radians2degrees(vectorAngle(vWind)) - bearing
    if (mode === 'text') return (
        <>
            <div>{fmtDegrees(twa)} twa</div>
            <div>{fmtWindSpeed(boatSpeed)}</div>
        </>
    )
    return <></>
}

import { IApiBuoyOutput, IApiPlanOutput, IApiRouteOutput } from "@/types/api"
import Link from "next/link"
import { cmpRouteLegOrder, FleshedRouteBuoy, FleshedRouteLeg, fleshenRoute, fmtNM, route2LengthNm } from "@/lib/route"
import { bearingLatLan, calcTwa, distanceLatLng, fmtDegrees, fmtHoursMinutes, fmtHumanTime, fmtWindSpeed, meters2nM, metersPerSecond2knots, ShipPolar, sort, Timestamp, Vector, vectorMagnitude, wind2degrees, WindIndicatorMode } from "tslib"
import { IndexedWind, windAtTimeAndLocation } from 'tslib';
import { useState } from "react";
import { useChange } from "@/hooks/useChange";
import { fmtTwa } from 'tslib';


type RouteOptionProps = {
    pageRoot: string
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
        pageRoot,
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
        pageRoot={pageRoot}
        plan={plan}
        route={route}
        onHoverRoute={onHoverRoute}
        selectedRoute={selectedRoute}
    />
}

export default RouteOption

const AlternateRoute = (props: {
    pageRoot: string
    route: IApiRouteOutput
    plan: IApiPlanOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    selectedRoute?: IApiRouteOutput
}) => {
    const {
        pageRoot,
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
                href={`/${pageRoot}/plan/${plan.id}/route/${route.id}`}
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
    pageRoot: string
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
        pageRoot,
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
                href={`/${pageRoot}/plan/${plan.id}/route/${route.id}`}
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
                                shopPolar={shipPolar}
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
                            shipPolar={shipPolar}
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
        shipPolar: ShipPolar
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
        shipPolar,
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
                    <TimeIndicator
                        timestamp={buoy.timestamp}
                    />
                    {routeLeg && (
                        <LegIndicator
                            startBuoy={routeLeg.startBuoy}
                            endBuoy={routeLeg.endBuoy}
                        />
                    )}
                    <WindIndicator
                        timestamp={buoy.timestamp}
                        vWind={vWind}
                    />
                    <BoatIndicator
                        shipPolar={shipPolar}
                        vWind={vWind}
                        boatSpeed={boatSpeed}
                        bearing={bearing}
                    />
                </div>
            )}
        </div>
    )
}

const LegIndicator = (props: {
    startBuoy: IApiBuoyOutput
    endBuoy: IApiBuoyOutput
    mode?: WindIndicatorMode
}) => {
    const {
        startBuoy,
        endBuoy,
        mode = 'text',
    } = props
    if (mode === 'text') return (
        <>
            <div>{fmtDegrees(bearingLatLan(startBuoy, endBuoy))}</div>
            <div>{fmtNM(meters2nM(distanceLatLng(startBuoy, endBuoy)))}</div>
        </>
    )
    return <></>
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
            <div>{fmtDegrees(wind2degrees(vWind))}</div>
            <div>{fmtWindSpeed(metersPerSecond2knots(vectorMagnitude(vWind)))}</div>
        </>
    )
    return <></>
}

const TimeIndicator = (props: {
    timestamp: Timestamp
    mode?: WindIndicatorMode
}) => {
    const {
        timestamp,
        mode = 'text',
    } = props
    if (mode === 'text') return (
        <>
            <div>{fmtHoursMinutes(timestamp)}</div>
        </>
    )
    return <></>
}

const BoatIndicator = (props: {
    shipPolar: ShipPolar
    vWind: Vector
    boatSpeed?: number
    bearing?: number
    mode?: WindIndicatorMode
}) => {
    const {
        shipPolar,
        vWind,
        boatSpeed,
        bearing,
        mode = 'text',
    } = props
    if (undefined === bearing || undefined === boatSpeed) return <></>
    const twa = calcTwa(vWind, bearing)
    if (mode === 'text') return (
        <>
            <div>{fmtTwa(twa)}</div>
            <div>{fmtWindSpeed(boatSpeed)}</div>
        </>
    )
    return <></>
}

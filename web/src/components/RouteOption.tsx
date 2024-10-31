import { IApiBuoyOutput, IApiPlanOutput, IApiRouteOutput } from "@/types/api"
import Link from "next/link"
import { cmpRouteLegOrder, FleshedRoute, FleshedRouteBuoy, FleshedRouteLeg, fmtNM, route2LengthNm } from "@/lib/route"
import { bearingLatLan, calcTwa, distanceLatLng, fmtDegrees, fmtHoursMinutes, fmtHumanTime, fmtWindSpeed, meters2nM, metersPerSecond2knots, ShipPolar, sort, Timestamp, Vector, vectorMagnitude, wind2degrees, WindIndicatorMode } from "tslib"
import { IndexedWind, windAtTimeAndLocation } from 'tslib';
import { fmtTwa } from 'tslib';


type RouteOptionProps = {
    pageRoot: string
    shipPolar: ShipPolar
    wind: IndexedWind[]
    plan: IApiPlanOutput
    route: FleshedRoute
    onHoverRoute?: (route?: IApiRouteOutput) => void
    onHoverRouteLeg?: (leg?: FleshedRouteLeg) => void
    onSelectRouteLeg?: (leg?: FleshedRouteLeg) => void
    selectedRoute?: FleshedRoute
    selectedRouteLeg?: FleshedRouteLeg
    hoveredRouteLeg?: FleshedRouteLeg
    showBuoys?: boolean
    selectedWindTimestamp?: Timestamp
}
const RouteOption = (props: RouteOptionProps) => {
    const {
        pageRoot,
        shipPolar,
        wind,
        selectedWindTimestamp,
        plan,
        route,
        onHoverRoute,
        onHoverRouteLeg,
        onSelectRouteLeg,
        selectedRoute,
        selectedRouteLeg,
        hoveredRouteLeg,
        showBuoys,
    } = props

    if (selectedRoute?.id === route.id) return (
        <SelectedRoute
            shipPolar={shipPolar}
            wind={wind}
            selectedWindTimestamp={selectedWindTimestamp}
            plan={plan}
            route={route}
            onHoverRoute={onHoverRoute}
            onHoverRouteLeg={onHoverRouteLeg}
            onSelectRouteLeg={onSelectRouteLeg}
            selectedRoute={selectedRoute}
            selectedRouteLeg={selectedRouteLeg}
            hoveredRouteLeg={hoveredRouteLeg}
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
                href={`${pageRoot}/plan/${plan.id}/route/${route.id}`}
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
    selectedWindTimestamp?: Timestamp
    route: FleshedRoute
    plan: IApiPlanOutput
    onHoverRoute?: (route?: IApiRouteOutput) => void
    onHoverRouteLeg?: (leg?: FleshedRouteLeg) => void
    onSelectRouteLeg?: (leg?: FleshedRouteLeg) => void
    selectedRoute?: IApiRouteOutput
    selectedRouteLeg?: FleshedRouteLeg
    hoveredRouteLeg?: FleshedRouteLeg
    showBuoys?: boolean
}) => {
    const {
        shipPolar,
        wind,
        selectedWindTimestamp,
        route,
        plan,
        onHoverRoute,
        onHoverRouteLeg,
        onSelectRouteLeg,
        selectedRoute,
        selectedRouteLeg,
        hoveredRouteLeg,
        showBuoys,
    } = props

    const onMouseEnter = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute(route)
    const onMouseLeave = (route: IApiRouteOutput) => () => onHoverRoute && onHoverRoute()

    if (!route) {
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
            <div className="flex flex-col">
                <div className="flex flex-row content-start gap-4">
                    <div className="flex flex-col">
                        <div className="">
                            {route.name}
                        </div>
                        <div className="">
                            {fmtHumanTime(plan.startTime)}
                        </div>
                    </div>
                    {route && (
                        <div className="text-xs">
                            {fmtNM(route.distance)}
                        </div>
                    )}
                </div>
                {showBuoys && (
                    <div className="flex-col gap-2">
                        {sort(cmpRouteLegOrder)(route.legs).map(routeLeg => (
                            <RouteBuoy
                                shipPolar={shipPolar}
                                wind={wind}
                                key={routeLeg.leg.id}
                                plan={plan}
                                route={route}
                                routeLeg={routeLeg as FleshedRouteLeg}
                                buoy={(routeLeg as FleshedRouteLeg).startBuoy}
                                selectedWindTimestamp={selectedWindTimestamp}
                                onHoverRouteLeg={onHoverRouteLeg}
                                onSelectRouteLeg={onSelectRouteLeg}
                                selectedRouteLeg={selectedRouteLeg}
                                hoveredRouteLeg={hoveredRouteLeg}
                            />
                        ))}
                        <RouteBuoy
                            shipPolar={shipPolar}
                            wind={wind}
                            plan={plan}
                            route={route}
                            buoy={route.endBuoy}
                            onHoverRouteLeg={onHoverRouteLeg}
                            onSelectRouteLeg={onSelectRouteLeg}
                            selectedRouteLeg={selectedRouteLeg}
                            hoveredRouteLeg={hoveredRouteLeg}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

const RouteBuoy = (props:
    {
        shipPolar: ShipPolar
        wind: IndexedWind[]
        selectedWindTimestamp?: Timestamp
        plan: IApiPlanOutput
        route: FleshedRoute
        buoy: FleshedRouteBuoy
        routeLeg?: FleshedRouteLeg
        onHoverRouteLeg?: (leg?: FleshedRouteLeg) => void
        onSelectRouteLeg?: (leg?: FleshedRouteLeg) => void
        selectedRouteLeg?: FleshedRouteLeg
        hoveredRouteLeg?: FleshedRouteLeg
    }
) => {
    const {
        wind,
        selectedWindTimestamp,
        plan,
        route,
        routeLeg,
        buoy,
        shipPolar,
        onHoverRouteLeg,
        onSelectRouteLeg,
        selectedRouteLeg,
        hoveredRouteLeg,
    } = props

    const boatSpeed = routeLeg?.boatSpeed
    const bearing = routeLeg?.bearing
    const vWind=windAtTimeAndLocation(wind, buoy.timestamp, buoy)
    
    const onMouseEnter = () => onHoverRouteLeg && onHoverRouteLeg(routeLeg)
    const onMouseLeave = () => onHoverRouteLeg && onHoverRouteLeg()
    const onClick = () => {
        onSelectRouteLeg && onSelectRouteLeg(routeLeg)
    }

    const isSelected = selectedRouteLeg && routeLeg?.leg.id === selectedRouteLeg.leg.id
    const isHovered = hoveredRouteLeg && routeLeg?.leg.id === hoveredRouteLeg.leg.id
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={`
                flex
                justify-between
                gap-4 
                ${isSelected || isHovered ? "bg-white" : "bg-blue-100" }
                hover:bg-white
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
            `}
        >
            <div>
                {buoy.name}
            </div>
            {selectedWindTimestamp !== undefined && (
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

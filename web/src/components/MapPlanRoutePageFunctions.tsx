"use client"

import { IApiBulkWind, IApiBuoyOutput, IApiGeometryOutput, IApiLegOutput, IApiMapOutput, IApiPlanOutput, IApiRouteLegOutput, IApiRouteOutput, IApiShipOutput } from "@/types/api"
import MapCanvas from "./ MapCanvas"
import { useCallback, useState } from "react"
import RouteOptions from "./RouteOptions"
import { plan2region } from "@/lib/graph"
import { bulkWind2indexedWind, IndexedWind, last, parseShipPolar, Timestamp, timestamp2epoch, windAtTime } from "tslib"
import { findRouteLegAtTime, FleshedRouteLeg, fleshenRoute, isFleshedRoute, plan2longestRoute } from "@/lib/route"
import { useChange } from "@/hooks/useChange"
import { getPlan } from "@/actions/plan"
import usePolling from "@/hooks/usePolling"

type MapPlanRoutePageClientFunctionsProps = {
    pageRoot: string
    ship: IApiShipOutput
    map: IApiMapOutput
    wind: IndexedWind[]
    plan: IApiPlanOutput
    route?: IApiRouteOutput
    buoys: IApiBuoyOutput[]
    geometry: IApiGeometryOutput
}

const MapPlanRoutePageClientFunctions = (props: MapPlanRoutePageClientFunctionsProps) => {
    const {
        pageRoot,
        ship,
        map,
        wind,
        plan,
        route,
        buoys,
        geometry,
    } = props

    const [indexedWind] = useState(bulkWind2indexedWind(wind))
    const [shipPolar] = useState(parseShipPolar(ship.polar))
    const [selectedBuoy, setSelectedBuoy] = useState<IApiBuoyOutput | undefined>(undefined)
    const [selectedLeg, setSelectedLeg] = useState<IApiLegOutput | undefined>(undefined)
    const [hoveredRoute, setHoveredRoute] = useState<IApiRouteOutput | undefined>(undefined)
    const [selectedRouteLeg, setSelectedRouteLeg] = useState<FleshedRouteLeg | undefined>(undefined)
    const [hoveredRouteLeg, setHoveredRouteLeg] = useState<FleshedRouteLeg | undefined>(undefined)
    const [showWind, setShowWind] = useState(true)
    const [selectedWindTimestamp, setSelectedWindTimestamp] = useState<Timestamp>(wind[0].timestamp)
    const [actualPlan, setActualPlan] = useState(plan)
    const [actualRoutes, setActualRoutes] = useState(plan.routes.map(fleshenRoute(shipPolar, indexedWind, actualPlan)).filter(isFleshedRoute))
    const [actualRoute, setActualRoute] = useState(
        route
        ? fleshenRoute(parseShipPolar(ship.polar), indexedWind, plan)(route)
        : fleshenRoute(shipPolar, indexedWind, plan)(plan2longestRoute(plan)!)
    )
    const [showRegion, setShowRegion] = useState(plan2region(actualPlan))

    useChange(
        () => {
            if (route) setActualRoute(fleshenRoute(shipPolar, indexedWind, plan)(route))
        },
        [route]
    )

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
                setActualRoutes(polledPlan.routes.map(fleshenRoute(shipPolar, indexedWind, polledPlan)).filter(isFleshedRoute))
                setShowRegion(plan2region(polledPlan))
                const longestRoute = plan2longestRoute(polledPlan)
                if (!longestRoute) return
                setActualRoute(fleshenRoute(shipPolar, indexedWind, polledPlan)(longestRoute))
            }
        },
        [polledPlan?.status]
    )
    if (polledPlan?.status === 'DONE') cancelPolling()

    const onSelectWindTimestamp = (timestamp: Timestamp) => {
        setSelectedWindTimestamp(timestamp)
        const routeLegAtTime = findRouteLegAtTime(timestamp)(actualRoute)
        setSelectedRouteLeg(routeLegAtTime)
    }

    const onShowWind = (showWind: boolean) => setShowWind(showWind)

    const onSelectBuoy = (buoy?: IApiBuoyOutput) => {
        setSelectedBuoy(buoy)
    }
    const onSelectLeg = (leg?: IApiLegOutput) => {
        setSelectedLeg(leg)
    }
    const onClearSelection = () => {
        setSelectedBuoy(undefined)
        setSelectedLeg(undefined)
    }
    const onHoverRoute = (route?: IApiRouteOutput) => {
        setHoveredRoute(route)
    }
    const onSelectRouteLeg = (leg?: FleshedRouteLeg) => {
        setSelectedRouteLeg(leg)
        if (!leg) return
        const windTime = windAtTime(indexedWind, leg.startTime).timestamp
        setSelectedWindTimestamp(windTime)
    }
    const onHoverRouteLeg = (leg?: FleshedRouteLeg) => {
        setHoveredRouteLeg(leg)
    }

    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="max-h-[calc(100vh-5rem-6rem)] md:max-h-[calc(100vh-5rem-4rem-2rem)] flex flex-col gap-4">
                <div className="flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        <span>Plan {actualPlan.name} </span>
                    </h1>
                </div>
                <RouteOptions
                    pageRoot={pageRoot}
                    shipPolar={ship && parseShipPolar(ship.polar)}
                    wind={indexedWind}
                    plan={actualPlan}
                    routes={actualRoutes}
                    onHoverRoute={onHoverRoute}
                    onHoverRouteLeg={onHoverRouteLeg}
                    onSelectRouteLeg={onSelectRouteLeg}
                    selectedRoute={actualRoute}
                    selectedRouteLeg={selectedRouteLeg}
                    hoveredRouteLeg={hoveredRouteLeg}
                    selectedWindTimestamp={selectedWindTimestamp}
                />
            </div>
            <MapCanvas
                initialBoundingRegion={showRegion}
                map={map}
                geometry={geometry}
                wind={wind}
                buoys={buoys}
                legs={[]}
                onClearSelections={onClearSelection}
                selectedBuoy={selectedBuoy}
                onSelectBuoy={onSelectBuoy}
                onSelectLeg={onSelectLeg}
                selectedLeg={selectedLeg}
                onSelectRouteLeg={onSelectRouteLeg}
                onHoverRouteLeg={onHoverRouteLeg}
                selectedRouteLeg={selectedRouteLeg}
                hoveredRouteLeg={hoveredRouteLeg}
                routeLegs={actualRoute?.legs}
                hoverRouteLegs={hoveredRoute?.legs}
                showWind={showWind}
                onShowWind={onShowWind}
                selectedWindTimestamp={selectedWindTimestamp}
                onSelectWindTimestamp={onSelectWindTimestamp}
            />
        </div>
    )
}

export default MapPlanRoutePageClientFunctions
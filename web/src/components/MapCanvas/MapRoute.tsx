import { IApiBuoyOutput, IApiRouteLegOutput } from "@/types/api"
import MapRouteLeg from "./MapRouteLeg"
import { idIs } from "tslib"

type MapRouteProps = {
    buoys: IApiBuoyOutput[]
    routeLegs: IApiRouteLegOutput[]
    color?: string
    onSelectRouteLeg?: (buoy?: IApiRouteLegOutput) => void
    onHoverRouteLeg?: (leg?: IApiRouteLegOutput) => void
    hoveredRouteLeg?: IApiRouteLegOutput
    selectedRouteLeg?: IApiRouteLegOutput
    screen2svgFactor?: number
}

const MapRoute = (props: MapRouteProps) => {
    const {
        buoys,
        routeLegs,
        color,
        onSelectRouteLeg,
        onHoverRouteLeg,
        selectedRouteLeg,
        hoveredRouteLeg,
    } = props

    return (
        routeLegs.map((routeLeg) => (
            <MapRouteLeg key={routeLeg.leg.id}
                color={color}
                routeLeg={routeLeg}
                startBuoy={buoys?.find(idIs(routeLeg.leg.startBuoyId))}
                endBuoy={buoys?.find(idIs(routeLeg.leg.endBuoyId))}
                onSelect={onSelectRouteLeg}
                onHover={onHoverRouteLeg}
                isSelected={routeLeg.leg.id === selectedRouteLeg?.leg.id}
                isHovered={routeLeg.leg.id === hoveredRouteLeg?.leg.id}
            />
        ))
    )
}

export default MapRoute
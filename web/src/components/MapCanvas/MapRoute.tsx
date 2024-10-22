import { IApiBuoyOutput, IApiLegOutput, IApiRouteLegOutput } from "@/types/api"
import MapRouteLeg from "./MapRouteLeg"
import { idIs } from "tslib"

type MapRouteProps = {
    buoys: IApiBuoyOutput[]
    routeLegs: IApiRouteLegOutput[]
    color?: string
    selectedLeg?: IApiLegOutput
    onSelectLeg?: (buoy?: IApiLegOutput) => void
}

const MapRoute = (props: MapRouteProps) => {
    const {
        buoys,
        routeLegs,
        color,
        onSelectLeg,
        selectedLeg,
    } = props

    return (
        routeLegs.map((routeLeg) => (
            <MapRouteLeg key={routeLeg.leg.id}
                color={color}
                routeLeg={routeLeg}
                startBuoy={buoys?.find(idIs(routeLeg.leg.startBuoyId))}
                endBuoy={buoys?.find(idIs(routeLeg.leg.endBuoyId))}
                onSelect={onSelectLeg}
                isSelected={routeLeg.leg.id === selectedLeg?.id}
            />
        ))
    )
}

export default MapRoute
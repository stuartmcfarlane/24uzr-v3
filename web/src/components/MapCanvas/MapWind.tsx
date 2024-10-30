import { IApiBulkWind } from "@/types/api"
import MapWindArrow from "./MapWindArrow"
import { Rect, Timestamp, timestampIs } from "tslib"

type MapWindProps = {
    wind: IApiBulkWind[]
    screen2svgFactor: number
    selectedWindTimestamp?: Timestamp
    boundingRect?: Rect
}
const MapWind = (props: MapWindProps) => {
    const {
        wind,
        screen2svgFactor,
        selectedWindTimestamp,
        boundingRect,
    } = props

    const shownWind = wind && selectedWindTimestamp && wind.find(timestampIs(selectedWindTimestamp))
    return (<>
        {shownWind && shownWind.data.map(
            (wind, key) => (
                <MapWindArrow
                    key={key}
                    wind={wind}
                    screen2svgFactor={screen2svgFactor}
                />
            )
        )}
    </>)
}

export default MapWind 
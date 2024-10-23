import { IApiBulkWind } from "@/types/api"
import MapWindArrow from "./MapWindArrow"
import { Rect } from "tslib"

type MapWindProps = {
    wind: IApiBulkWind[]
    selectedTime?: string
    screen2svgFactor: number
    windTime?: number
    boundingRect?: Rect
}
const MapWind = (props: MapWindProps) => {
    const {
        wind,
        screen2svgFactor,
        windTime,
        boundingRect,
    } = props

    const timestamps = wind.map(w => w.timestamp)
    const timestamp = timestamps[windTime || 0]
    const shownWind = wind && wind.find(w => w.timestamp === timestamp)
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
import { IApiBulkWind } from "@/types/api"
import MapWindArrow from "./MapWindArrow"

type MapWindProps = {
    wind: IApiBulkWind[]
    selectedTime?: string
    screen2svgFactor: number

}
const MapWind = (props: MapWindProps) => {
    const {
        wind,
        selectedTime,
        screen2svgFactor
    } = props

    const timestamp = selectedTime || wind.map(w => w.timestamp)[0]
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
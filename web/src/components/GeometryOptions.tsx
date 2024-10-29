import { uploadGeoJson } from "@/actions/geometry"
import { setMapRegion } from "@/actions/map"
import { useChange } from "@/hooks/useChange"
import { decimal2geo } from "@/lib/geo"
import { IApiMapOutput, PartialRegion, Region } from "@/types/api"
import { useState } from "react"
import { regionBottomLeft, regionTopRight } from "tslib"

type GeometryOptionsProps = {
    map: IApiMapOutput
    selectedMapRegion?: PartialRegion
}
const GeometryOptions = (props: GeometryOptionsProps) => {
    const {
        map,
        selectedMapRegion,
    } = props

    const [bottomLeft, setBottomLeft] = useState(decimal2geo(regionBottomLeft(map)))
    const [topRight, setTopRight] = useState(decimal2geo(regionTopRight(map)))

    useChange(
        () => {
            if (!selectedMapRegion) {
                setTopRight(decimal2geo(regionTopRight(map)))
                setBottomLeft(decimal2geo(regionBottomLeft(map)))
                return
            }
            const newBottomLeft = decimal2geo({ lat: selectedMapRegion.lat1, lng: selectedMapRegion.lng1})
            setBottomLeft(newBottomLeft || '')
            if (selectedMapRegion.lat2 && selectedMapRegion.lng2) {
                const newTopRight = decimal2geo({ lat: selectedMapRegion.lat2, lng: selectedMapRegion.lng2 })
                setTopRight(newTopRight || '')
            }
            else setTopRight('')
        },
        [selectedMapRegion]
    )
    return (<>
        <form action={uploadGeoJson} className="flex flex-col gap-4">
            <label>
                <input
                    type="file"
                    name="file"
                    className="ring-2 ring-gray-300 rounded-md p-4"
                />
            </label>
            <button
                type="submit"
                className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >
                Import geojson
            </button>
            <input type="hidden" name="mapId" value={map.id} />
        </form>
        <form action={setMapRegion} className="flex flex-col gap-4">
            <input
                type="text"
                name="bottomLeft"
                value={bottomLeft}
                placeholder="bottom left"
                className="ring-2 ring-gray-300 rounded-md p-4"
                readOnly={true}
            />
            <input
                type="text"
                name="topRight"
                value={topRight}
                placeholder="drag a region on the map"
                className="ring-2 ring-gray-300 rounded-md p-4"
                readOnly={true}
            />
            <button
                type="submit"
                className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >
                Set map region
            </button>
            <input type="hidden" name="mapId" value={map.id} />
        </form>
    </>)
}

export default GeometryOptions
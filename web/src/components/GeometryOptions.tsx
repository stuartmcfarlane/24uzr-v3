import { uploadGeoJson } from "@/actions/geometry"
import { IApiMapOutput } from "@/types/api"

type GeometryOptionsProps = {
    map: IApiMapOutput
}
const GeometryOptions = (props: GeometryOptionsProps) => {
    const {
        map,
    } = props

    return (
        <form action={uploadGeoJson}  className="flex flex-col gap-4">
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
    )
}

export default GeometryOptions
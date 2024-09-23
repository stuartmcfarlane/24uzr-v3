import { createBuoy } from "@/actions/map"
import { IApiMapOutput } from "@/types/api"

type AddBuoyFormProps = {
    map: IApiMapOutput
}
const AddBuoyForm = (props: AddBuoyFormProps) => {
    const { map } = props
    return (
        <form action={createBuoy} className="flex flex-col gap-4 mt-4 border-t-2 pt-4">
            <input
                type="text"
                name="name"
                placeholder="name"
                className="ring-2 ring-gray-300 rounded-md p-4"
            />
            <input
                type="text"
                name="lat"
                placeholder="latitude"
                className="ring-2 ring-gray-300 rounded-md p-4"
            />
            <input
                type="text"
                name="lng"
                placeholder="longitude"
                className="ring-2 ring-gray-300 rounded-md p-4"
            />
            <button
                type="submit"
                className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >Add buoy</button>

            <input type="hidden" name="mapId" value={map.id}/>
        </form>
    )
}

export default AddBuoyForm
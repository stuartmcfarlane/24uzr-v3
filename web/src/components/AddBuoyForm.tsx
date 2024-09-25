import { createBuoyWithForm } from "@/actions/map"
import { IApiMapOutput } from "@/types/api"
import { useRef } from "react"

type AddBuoyFormProps = {
    map: IApiMapOutput
}
const AddBuoyForm = (props: AddBuoyFormProps) => {
    const { map } = props

    const formRef = useRef<HTMLFormElement>(null)

    const createBuoyAction = async (formData: FormData) => {
        await createBuoyWithForm(formData)
        formRef.current?.reset()
    }
    return (
        <form ref={formRef} action={createBuoyAction} className="flex flex-col gap-4">
            <input
                type="text"
                name="name"
                placeholder="name"
                className="ring-2 ring-gray-300 rounded-md p-4"
            />
            <input
                type="text"
                name="nameLatLng"
                placeholder="name, lat, long"
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
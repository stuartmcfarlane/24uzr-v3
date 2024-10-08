import { deleteBuoy, updateBuoyWithForm } from "@/actions/map"
import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import { MouseEvent, useEffect, useState } from "react"

type EditBuoyFormProps = {
    map: IApiMapOutput
    buoy: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    onDeleteBuoy?: (buoy?: IApiBuoyOutput) => void
}
const EditBuoyForm = (props: EditBuoyFormProps) => {
    const {
        map,
        buoy,
        onSelectBuoy,
        onDeleteBuoy,
    } = props
    const [name, setName] = useState(buoy.name)
    const [lat, setLat] = useState(buoy.lat)
    const [lng, setLng] = useState(buoy.lng)
    const [id, setId] = useState(buoy.id)
    const [mapId, setMapId] = useState(map.id)

    useEffect( () => { setName(buoy.name) }, [buoy.name] )
    useEffect( () => { setLat(buoy.lat) }, [buoy.lat] )
    useEffect( () => { setLng(buoy.lng) }, [buoy.lng] )
    useEffect( () => { setId(buoy.id) }, [buoy.id] )
    useEffect(() => { setMapId(buoy.mapId) }, [buoy.mapId])
    
    const onCancel = () => {
        onSelectBuoy && onSelectBuoy()
    }

    const updateBuoyAction = async (formData: FormData) => {
        await updateBuoyWithForm(formData)
        onSelectBuoy && onSelectBuoy()
    }

    const onDelete = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        onDeleteBuoy && onDeleteBuoy(buoy)
    }

    return (
        <form
            action={updateBuoyAction}
            className="flex flex-col gap-4"
        >
            <input
                type="text"
                name="name"
                value={name}
                placeholder="name"
                onChange={e => setName(e.target.value)}
                className="ring-2 ring-gray-300 rounded-md p-4"
            />
            <input
                type="text"
                name="lat"
                value={lat}
                onChange={e => setLat(parseFloat(e.target.value))}
                placeholder="latitude"
                className="ring-2 ring-gray-300 rounded-md p-4"
            />
            <input
                type="text"
                name="lng"
                value={lng}
                onChange={e => setLng(parseFloat(e.target.value))}
                placeholder="longitude"
                className="ring-2 ring-gray-300 rounded-md p-4"
            />
            <button
                type="submit"
                className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >
                Update buoy
            </button>
            <button
                onClick={onCancel}
                className="bg-24uzr-red text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >
                Cancel
            </button>
            <button
                onClick={onDelete}
                className="bg-24uzr-red text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >
                Delete
            </button>

            <input
                type="hidden"
                name="id"
                value={id}
                onChange={e => setId(parseInt(e.target.value))}
            />
            <input
                type="hidden"
                name="mapId"
                value={mapId}
                onChange={e => setMapId(parseInt(e.target.value))}
            />
        </form>
    )
}

export default EditBuoyForm
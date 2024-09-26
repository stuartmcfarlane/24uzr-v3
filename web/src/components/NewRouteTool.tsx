"use client"

import { createRouteWithForm } from "@/actions/map"
import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import BuoyIcon from "./Icons/BuoyIcon"

type NewRouteToolProps = {
    map: IApiMapOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
}
export const NewRouteTool = (props: NewRouteToolProps) => {
    const {
        map,
        startBuoy,
        endBuoy,
    } = props
    return (
        <form action={createRouteWithForm}
            className="flex flex-col"
        >
            <input
                type="text"
                name="name"
                placeholder="route name"
                className="ring-2 ring-gray-300 rounded-md p-4 w-full my-2"
            />
            <div className="p-4 w-full my-2 flex">
                <div>Start</div>
                <div className="w-7"><BuoyIcon /></div>
                <div className="flex-grow">
                    {startBuoy?.name}
                </div>
            </div>
            <div className="p-4 w-full my-2 flex">
                <div>End</div>
                <div className="w-7"><BuoyIcon /></div>
                <div className="flex-grow">
                    {endBuoy?.name}
                </div>
            </div>
            <button className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed my-2 w-full"
                type="submit"
            >
                create
            </button>
            <input type="hidden" name="mapId" value={map.id}/>
            <input type="hidden" name="startBuoyId" value={startBuoy?.id}/>
            <input type="hidden" name="endBuoyId" value={endBuoy?.id}/>
        </form>
    )
}
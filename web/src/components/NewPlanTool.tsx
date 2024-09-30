"use client"

import { createPlanWithForm } from "@/actions/map"
import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import BuoyIcon from "./Icons/BuoyIcon"
import PlanIcon from "./Icons/PlanIcon"
import { FormEvent, useState } from "react"
import { useChange } from "@/hooks/useChange"

type NewPlanToolProps = {
    map: IApiMapOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
}
export const NewPlanTool = (props: NewPlanToolProps) => {
    const {
        map,
        startBuoy,
        endBuoy,
    } = props

    const [defaultPlanName, setDefaultPlanName] = useState('plan name')
    useChange(
        () => {
            if (startBuoy && endBuoy) {
                setDefaultPlanName(`${startBuoy.name} -> ${endBuoy.name}`)
                return
            }
            setDefaultPlanName('plan name')
        },
        [startBuoy, endBuoy]
    )
    return (<>
        <div className="flex gap-4">
            <div className="w-7">
                <PlanIcon />
            </div>
            <div className="">
                Create plan
            </div>
        </div>
        <form action={createPlanWithForm}
            className="flex flex-col"
        >
            <input
                type="text"
                name="name"
                placeholder={defaultPlanName}
                className="ring-2 ring-gray-300 rounded-md p-4 w-full my-2"
            />
            <input
                type="text"
                name="raceHoursRemaining"
                placeholder='race remaining hours'
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
            <input type="hidden" name="defaultName" value={defaultPlanName}/>
        </form>
    </>)
}
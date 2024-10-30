"use client"

import { createPlanWithForm } from "@/actions/plan"
import { IApiBuoyOutput, IApiMapOutput, IApiShipOutput } from "@/types/api"
import BuoyIcon from "./Icons/BuoyIcon"
import PlanIcon from "./Icons/PlanIcon"
import { useState } from "react"
import { useChange } from "@/hooks/useChange"
import { addSeconds, hours2seconds, now, plural, seq, timestamp2string } from "tslib"

type NewPlanToolProps = {
    rootPage: string
    map: IApiMapOutput
    ship: IApiShipOutput
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
}
export const NewPlanTool = (props: NewPlanToolProps) => {
    const {
        rootPage,
        map,
        ship,
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
        {!ship && (
            <div className="text-24uzr-red">Please create a ship first</div>
        )}
        {ship && (
            <form action={createPlanWithForm}
                className="flex flex-col"
            >
                <input
                    type="text"
                    name="name"
                    placeholder={defaultPlanName}
                    className="ring-2 ring-gray-300 rounded-md p-4 w-full my-2"
                />
                <label>Start time</label>
                <select
                    defaultValue={8}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="startTime"
                >
                    {seq(0, 24)
                        .map(deltaHours => (
                            <option
                                key={deltaHours}
                                value={timestamp2string(addSeconds(hours2seconds(deltaHours))(now()))}
                            >
                                {deltaHours === 0 ? 'starting now' : <>
                                    +{deltaHours} hours
                                </>
                                }
                            </option>
                        ))
                    }
                </select>
                <label>Plan length</label>
                <select
                    defaultValue={timestamp2string(now())}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="raceHoursRemaining"
                >
                    {seq(1, 12)
                        .map(hours => (
                            <option
                                key={hours}
                                value={hours}
                            >
                                {plural(`${hours} hour`, `${hours} hours`)(hours)}
                            </option>
                        ))
                    }
                </select>
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
                <input type="hidden" name="shipId" value={ship.id} />
                <input type="hidden" name="startBuoyId" value={startBuoy?.id}/>
                <input type="hidden" name="endBuoyId" value={endBuoy?.id}/>
                <input type="hidden" name="defaultName" value={defaultPlanName}/>
                <input type="hidden" name="rootPage" value={rootPage}/>
            </form>
        )}
    </>)
}
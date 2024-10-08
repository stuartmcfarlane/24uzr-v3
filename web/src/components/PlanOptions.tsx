import { IApiBuoyOutput, IApiMapOutput, IApiPlanOutput, IApiPlanOutput, IApiUserOutput } from "@/types/api"
import Link from "next/link"
import { NewPlanTool } from "./NewPlanTool"
import PlanIcon from "./Icons/PlanIcon"
import { MouseEvent } from "react"


type PlanOptionsProps = {
    map: IApiMapOutput
    plans: IApiPlanOutput[]
    startBuoy?: IApiBuoyOutput
    endBuoy?: IApiBuoyOutput
    onHoverPlan?: (plan?: IApiPlanOutput) => void
}
const PlanOptions = (props: PlanOptionsProps) => {
    const {
        map,
        plans,
        startBuoy,
        endBuoy,
        onHoverPlan,
    } = props

    const onMouseEnter = (plan: IApiPlanOutput) => () => onHoverPlan && onHoverPlan(plan)
    const onMouseLeave = (plan: IApiPlanOutput) => () => onHoverPlan && onHoverPlan()

    return (<>
        {!startBuoy && (<>
            <div className="flex gap-4">
                <div className="w-7">
                    <PlanIcon/>
                </div>
                <div className="">
                    Plans
                </div>
            </div>
            <div className="flex flex-col gap-4 overflow-x-scroll pr-4">
                {(plans || []).map(plan => (
                    <div
                        key={plan.id}
                        className="border p-2 hover:bg-24uzr hover:text-white"
                        onMouseEnter={onMouseEnter(plan)}
                        onMouseLeave={onMouseLeave(plan)}
                    >
                        <Link href={`/map/${map.id}/plan/${plan.id}`}>
                            {plan.name}
                        </Link>
                    </div>
                ))}
            </div>
        </>)}
        {startBuoy && (
            <NewPlanTool
                map={map}
                startBuoy={startBuoy}
                endBuoy={endBuoy}
            />
        )}
    </>)
}

export default PlanOptions
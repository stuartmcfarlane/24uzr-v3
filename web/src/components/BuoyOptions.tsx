import { IApiBuoyOutput, IApiMapOutput } from "@/types/api"
import EditBuoyForm from "./EditBuoyForm"
import AddBuoyForm from "./AddBuoyForm"

type BuoyOptionsProps = {
    map: IApiMapOutput
    buoy?: IApiBuoyOutput
    onSelectBuoy?: (buoy?: IApiBuoyOutput) => void
    onDeleteBuoy?: (buoy?: IApiBuoyOutput) => void
}
const BuoyOptions = (props: BuoyOptionsProps) => {
    const {
        map,
        buoy,
        onSelectBuoy,
        onDeleteBuoy,
    } = props

    return (
        buoy ? (
            <EditBuoyForm
                map={map}
                buoy={buoy}
                onSelectBuoy={onSelectBuoy}
                onDeleteBuoy={onDeleteBuoy}
            />
        ) : (
            <AddBuoyForm map={map} />
        )
    )
}

export default BuoyOptions
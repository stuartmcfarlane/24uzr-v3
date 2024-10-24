import { isActive } from "@/lib/ships"
import { IApiShipOutput } from "@/types/api"
import { ChangeEvent } from "react"
import { idIs } from "tslib"

type SelectShipFormProps = {
    ships: IApiShipOutput[]
    onSelectShip: (ship?: IApiShipOutput) => void
}
const SelectShipForm = (props: SelectShipFormProps) => {
    const {
        ships,
        onSelectShip,
    } = props
    
    const activeShip = ships.find(isActive)

    const onSelectChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        onSelectShip && onSelectShip((ships || []).find(idIs(parseInt(e.target.value))))
    }

    return (
        <select
            value={activeShip?.id}
            onChange={onSelectChanged}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
            {ships.map(ship => (
                <option
                    key={ship.id}
                    value={ship.id}
                >
                    {ship.name}
                </option>
            ))}
        </select>
    )
}

export default SelectShipForm
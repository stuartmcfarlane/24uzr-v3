import { updateShipPolar } from "@/actions/ship"
import { metersPerSecond2knots } from "@/lib/conversions"
import { cmpNumber, indexBy, indexByHash, project, sort, unique } from "@/lib/fp"
import { IApiShipOutput, IApiShipPolarOutput } from "@/types/api"

export type ShipPolarToolParams = {
    ship: IApiShipOutput
}
type ShipPolar = IApiShipPolarOutput &
{
    boatKnots?: number
}
export const ShipPolarTool = (params: ShipPolarToolParams) => {
    const { ship } = params
    const shipPolar = (ship.shipPolar || []).map(polar => ({
        ...polar,
        boatKnots: Math.round(metersPerSecond2knots(polar.boatMs) * 10) / 10
    }))
    const windKnots = shipPolars2windKnots(shipPolar)
    const windDegrees = shipPolars2windDegrees(shipPolar)
    const boatSpeedByWind = indexByWind(shipPolar)
    console.log(`boatSpeedByWindKnotsAndDegrees`, boatSpeedByWind)
    return (
        <div className="mt-4 text-xl">
            <form action={updateShipPolar}>
                <table className="table-auto">
                    <thead className="">
                        <td>Polar table</td>
                        <th colSpan={windDegrees.length + 1}>Wind angle</th>
                        <tr>
                            <th></th>
                            <th></th>
                            {windDegrees.map(degrees => (
                                <th key={degrees}>{degrees}°</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {windKnots.map((knots, idx) => (
                            <tr key={knots}>
                                {!idx && (
                                    <th className="" rowSpan={windKnots.length}>Wind speed</th>
                                )}
                                <th className=" px-2">{knots} kts</th>
                                {windDegrees.map(degrees => (
                                    <td key={degrees}>
                                        <input
                                            type='number'
                                            name={windHashRaw(knots, degrees)}
                                            value={boatSpeedByWind[windHashRaw(knots, degrees)]?.boatKnots}
                                            placeholder="kts"
                                            className="text-center border rounded w-20"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </form>
        </div>
    )
}

const shipPolars2windKnots = (shipPolar: IApiShipPolarOutput[]) => {
    if (shipPolar.length === 0) {
        return [ 5, 10, 15, 20, 15, 30 ]
    }
    return sort(cmpNumber)(unique(shipPolar.map(project('windKnots'))))
}

const shipPolars2windDegrees = (shipPolar: IApiShipPolarOutput[]) => {
    if (shipPolar.length === 0) {
        return [ 5, 10, 15, 20, 15, 30 ]
    }
    return sort(cmpNumber)(unique(shipPolar.map(project('windDegrees'))))
}
const windHashRaw = (knots: number, degrees: number) => `${knots}:${degrees}`
const windHash = (wind: ShipPolar) => windHashRaw(wind.windKnots, wind.windDegrees)
const indexByWind = indexByHash(windHash)

"use client"

import { updateShipPolar } from "@/actions/ship"
import { cmpNumber, sort, string2float, truthy } from "tslib"
import { IApiShipOutput } from "@/types/api"
import PadlockIcon from "./Icons/PadlockIcon";
import { ChangeEvent, useState } from "react";
import { fieldName, parseShipPolar } from "@/lib/shipPolar";

export type ShipPolarToolParams = {
    ship: IApiShipOutput
}
export const ShipPolarTool = (params: ShipPolarToolParams) => {
    const { ship } = params

    const [isLocked, setIsLocked] = useState(true)
    const [hasEdits, setHasEdits] = useState(0)
    const [shipPolar, setShipPolar] = useState(parseShipPolar(ship.polar))
    const windKnots = shipPolar.tws
    const windAngles = sort(cmpNumber)(Object.keys(shipPolar).map(k => parseInt(k)).filter(truthy)).map(k => `${k}`)
    const colsByTws = (shipPolar?.tws || []).reduce(
        (colsByTws, tws, col) => {
            colsByTws[tws] = col
            return colsByTws
        },
        {} as {[tws: string]: number}
    )

    const toggleLock = () => setIsLocked(was => !was)

    const onChange = (fieldName: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = string2float(e.target.value)
        const [, angle, tws] = fieldName.split(':')
        const col = colsByTws[tws]
        if (value === shipPolar[angle][col]) return
        setHasEdits(was => was+1)
        setShipPolar(shipPolar => {
            shipPolar[angle][col] = value
            return { ...shipPolar }
        })
    }
    return (
        <div className="mt-4 text-sm">
            <form action={updateShipPolar}>
                <table className="">
                    <thead className="h-8 border-b border-gray-600">
                        <tr>
                            <th className="flex">
                                <span>Wind velocity</span>
                                <span className="w-6">
                                    <PadlockIcon isLocked={isLocked} onClick={toggleLock} />
                                </span>
                            </th>
                            {windKnots.map(knots => (
                                <th key={knots} className={`px-2 text-tws-${knots}`}>{knots}kts</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-right">Beat angle</td>
                            {shipPolar.beatAngles.map((angle, col) => (
                                <td key={col} className={`text-right text-tws-${windKnots[col]}`}>
                                    {
                                        isLocked
                                            ? `${angle}°`
                                            : <>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={angle}
                                                    onChange={onChange(fieldName('beatAngles', windKnots[col]))}
                                                    name={fieldName('beatAngles', windKnots[col])}
                                                    className="w-10 text-right appearance-none"
                                                />°
                                            </>
                                    }
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="text-right">Beat VMG</td>
                            {shipPolar.beatVMG.map((knots, col) => (
                                <td key={col} className={`text-right text-tws-${windKnots[col]}`}>
                                    {
                                        isLocked
                                            ? knots
                                            : <input
                                                type="number"
                                                step="0.01"
                                                value={knots}
                                                onChange={onChange(fieldName('beatVMG', windKnots[col]))}
                                                name={fieldName('beatVMG', windKnots[col])}
                                                className="w-10 text-right appearance-none"
                                            />
                                    }
                                </td>
                            ))}
                        </tr>
                        {windAngles.map(angle => (
                            <tr key={angle}>
                                <td className="text-right">{angle}°</td>
                                {shipPolar[angle].map((knots, col) => (
                                    <td key={col} className={`text-right text-tws-${windKnots[col]}`}>
                                        {
                                            isLocked
                                                ? knots
                                                : <input
                                                    type="number"
                                                    step="0.01"
                                                    value={knots}
                                                    onChange={onChange(fieldName(string2float(angle), windKnots[col]))}
                                                    name={fieldName(string2float(angle), windKnots[col])}
                                                    className="w-10 text-right appearance-none"
                                                />
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td className="text-right">Run angle</td>
                            {shipPolar.runAngles.map((angle, col) => (
                                <td key={col} className={`text-right text-tws-${windKnots[col]}`}>
                                    {
                                        isLocked
                                            ? `${angle}°`
                                            : <>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={angle}
                                                    onChange={onChange(fieldName('runAngles', windKnots[col]))}
                                                    name={fieldName('runAngles', windKnots[col])}
                                                    className="w-10 text-right appearance-none"
                                                />°
                                            </>
                                    }
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="text-right">Run VMG</td>
                            {shipPolar.runVMG.map((knots, col) => (
                                <td key={col} className={`text-right text-tws-${windKnots[col]}`}>
                                    {
                                        isLocked
                                            ? knots
                                            : <input
                                                type="number"
                                                step="0.01"
                                                value={knots}
                                                onChange={onChange(fieldName('runVMG', windKnots[col]))}
                                                name={fieldName('runVMG', windKnots[col])}
                                                className="w-10 text-right appearance-none"
                                            />
                                    }
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                <input type="hidden" name="id" value={ship.id} />
                {!!hasEdits && (
                    <button
                        type="submit"
                        className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed my-2"
                    >
                        Save changes
                    </button>
                )}
            </form>
        </div>
    )
}


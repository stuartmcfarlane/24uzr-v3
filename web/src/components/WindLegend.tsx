import { IApiBulkWind } from "@/types/api"
import { ChangeEvent, MouseEvent, useState } from "react"

type WindLegendProps = {
    wind: IApiBulkWind[]
    showWind?: boolean
    onShowWind?: (showWind: boolean) => void
    timeDelta?: number
    onTimeDelta?: (timeDelta: number) => void
}
const WindLegend = (props: WindLegendProps) => {

    const {
        wind,
        showWind,
        onShowWind,
        timeDelta,
        onTimeDelta,
    } = props

    const maxDelta = wind ? wind.length - 1 : 0
    const onToggleWind = (e: ChangeEvent<HTMLInputElement>) => {
        onShowWind && onShowWind(!showWind)
    }
    const onChangeTimeDelta = (e: ChangeEvent<HTMLInputElement>) => {
        onTimeDelta && onTimeDelta(parseInt(e.target.value))
    }
    return <div className="flex justify-between">
        <div>
            <input
                id="toggleWind"
                type="checkbox"
                checked={showWind}
                onChange={onToggleWind}
                className="ml-1 align-middle"
            />
            <label
                htmlFor="toggleWind"
                className="ml-1">
                wind
            </label>
        </div>
        {showWind && (<>
            {timeDelta !== undefined && maxDelta > 1 && (
                <div className="flex justify-evenly gap -4">
                    <button
                        onClick={() => onTimeDelta && onTimeDelta(Math.max(0, timeDelta - 1))}
                        disabled={timeDelta <= 0}
                        className="border-2 rounded-sm px-4"
                    >-</button>
                    <input
                        type="text"
                        value={timeDelta}
                        onChange={onChangeTimeDelta}
                        className="w-16 text-center"
                    />
                    <button
                        onClick={() => onTimeDelta && onTimeDelta(Math.min(maxDelta, timeDelta + 1))}
                        disabled={timeDelta >= maxDelta}
                        className="border-2 rounded-sm px-4"
                    >+</button>
                </div>
            )}
            <div className="flex">
                <div className={`bg-beufort-1 w-4`}></div>
                <div className={`bg-beufort-2 w-4`}></div>
                <div className={`bg-beufort-3 w-4`}></div>
                <div className={`bg-beufort-4 w-4`}></div>
                <div className={`bg-beufort-5 w-4`}></div>
                <div className={`bg-beufort-6 w-4`}></div>
                <div className={`bg-beufort-7 w-4`}></div>
                <div className={`bg-beufort-8 w-4`}></div>
                <div className={`bg-beufort-9 w-4`}></div>
                <div className={`bg-beufort-10 w-4`}></div>
            </div>
        </>)}
    </div>
}

export default WindLegend
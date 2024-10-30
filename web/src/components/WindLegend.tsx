import { fmtTimestamp, Timestamp } from "tslib"
import { IApiBulkWind } from "@/types/api"
import { ChangeEvent, MouseEvent, useState } from "react"
import { windIndexAtTime } from '../../../tslib/src/wind';
import { useChange } from "@/hooks/useChange";

type WindLegendProps = {
    wind: IApiBulkWind[]
    showWind?: boolean
    onShowWind?: (showWind: boolean) => void
    selectedWindTimestamp?: Timestamp
    onSelectWindTimestamp?: (timestamp: Timestamp) => void
}
const WindLegend = (props: WindLegendProps) => {

    const {
        wind,
        showWind,
        onShowWind,
        selectedWindTimestamp,
        onSelectWindTimestamp,
    } = props

    const [timeIndex, setTimeIndex] = useState(
        selectedWindTimestamp !== undefined
            ? windIndexAtTime(wind, selectedWindTimestamp)
            : 0
    )
    const maxDelta = wind ? wind.length - 1 : 0
    const onToggleWind = (e: ChangeEvent<HTMLInputElement>) => {
        onShowWind && onShowWind(!showWind)
    }
    const onChangeTimeIndex = (e: ChangeEvent<HTMLInputElement>) => {
        onUpdateTimeIndex(parseInt(e.target.value) - timeIndex)
    }
    const onUpdateTimeIndex = (delta: number) => {
        const newTimeIndex = Math.min(Math.max(0, timeIndex + delta), maxDelta)
        onSelectWindTimestamp && onSelectWindTimestamp(wind[newTimeIndex].timestamp)
    }
    useChange(
        () => {
            if (!selectedWindTimestamp) return
            setTimeIndex(windIndexAtTime(wind, selectedWindTimestamp))
        },
        [selectedWindTimestamp]
    )
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
            {timeIndex !== undefined && maxDelta > 1 && (
                <div className="flex gap-2 content-center">
                    <button
                        onClick={() => onUpdateTimeIndex(-1)}
                        disabled={timeIndex <= 0}
                        className="border-2 rounded-sm px-4"
                    >-</button>
                    <input
                        type="text"
                        value={timeIndex}
                        onChange={onChangeTimeIndex}
                        className="w-10 text-center"
                    />
                    <button
                        onClick={() => onUpdateTimeIndex(+1)}
                        disabled={timeIndex >= maxDelta}
                        className="border-2 rounded-sm px-4"
                    >+</button>
                    <span className="text-md align-middle inline-block">{fmtTimestamp(wind[timeIndex].timestamp)}</span>
                </div>
            )}
            <div className="flex">
                <div className={`bg-beaufort-1 w-4`}></div>
                <div className={`bg-beaufort-2 w-4`}></div>
                <div className={`bg-beaufort-3 w-4`}></div>
                <div className={`bg-beaufort-4 w-4`}></div>
                <div className={`bg-beaufort-5 w-4`}></div>
                <div className={`bg-beaufort-6 w-4`}></div>
                <div className={`bg-beaufort-7 w-4`}></div>
                <div className={`bg-beaufort-8 w-4`}></div>
                <div className={`bg-beaufort-9 w-4`}></div>
                <div className={`bg-beaufort-10 w-4`}></div>
            </div>
        </>)}
    </div>
}

export default WindLegend
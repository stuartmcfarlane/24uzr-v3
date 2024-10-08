import { MouseEvent, useState } from "react"

type WindLegendProps = {
    showWind?: boolean
    onShowWind?: (showWind: boolean) => void
}
const WindLegend = (props: WindLegendProps) => {

    const {
        showWind,
        onShowWind,
    } = props

    const onToggleWind = (e: MouseEvent<HTMLInputElement>) => {
        onShowWind && onShowWind(!showWind)
    }
    return <div className="flex justify-between">
        <div>
            <input
                id="toggleWind"
                type="checkbox"
                checked={showWind}
                onClick={onToggleWind}
                className="ml-1 align-middle"
            />
            <label
                htmlFor="toggleWind"
                className="ml-1">
                wind
            </label>
        </div>
        <div>scroll</div>
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
    </div>
}

export default WindLegend
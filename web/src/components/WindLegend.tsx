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
            <input type="checkbox" checked={showWind} onClick={onToggleWind} />
            <label>Show wind</label>
        </div>
        <div>scroll</div>
        <div>legend</div>
    </div>
}

export default WindLegend
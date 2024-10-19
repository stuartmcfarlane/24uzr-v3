const CSV_SEPARATOR = ';'

export type ShipPolarOrc = {
    tws: number[]
    beat_angle: number[]
    beat_vmg: number[]
    [angle: string]: number[]
    run_angle: number[]
    run_vmg: number[]
    speeds: number[]
    angles: number[]
}

export const shipPolarOrc2csv = (shipPolar: ShipPolarOrc): string => {

    const csvA = [
        ['twa/tws', ...shipPolar.speeds],
        ...shipPolar.beat_angle.map(
            (angle, idx) => {
                let a = new Array(shipPolar.speeds.length).fill('0')
                a[idx] = shipPolar.beat_vmg[idx]
                return [`${angle}`, ...a]
            }
        ),
        ...shipPolar.angles.map(
            angle => [ `${angle}`, ...shipPolar[angle]]
        ),
        ...shipPolar.run_angle.map(
            (angle, idx) => {
                let a = new Array(shipPolar.speeds.length).fill('0')
                a[idx] = shipPolar.run_vmg[idx]
                return [`${angle}`, ...a]
            }
        )
    ]
    const csv = csvA.map(row => row.join(CSV_SEPARATOR)).join(`\n`)
    return csv
}
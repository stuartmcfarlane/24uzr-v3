import { cmpNumber, int2string, not, sort, string2float, truthy } from "./fp"

const CSV_SEPARATOR = ';'

export type ShipPolar = {
    tws: number[]
    beatAngles: number[]
    beatVMG: number[]
    [angle: string]: number[]
    runAngles: number[]
    runVMG: number[]
}

export const parseShipPolar = (polarCsv: string): ShipPolar => {
    if (!polarCsv?.length) {
        return {
            tws: [ 6, 8, 10, 12, 14, 16, 20 ],
            beatAngles: [ 43.1, 41.2, 41.2, 41.2, 41.2, 41.2, 42.4 ],
            beatVMG: [ 2.67, 3.17, 3.53, 3.78, 3.87, 3.89, 3.82, ],
            52: [ 3.77, 4.48, 5.03, 5.35, 5.47, 5.51, 5.52 ],
            60: [ 4, 4.73, 5.26, 5.53, 5.66, 5.72, 5.74 ],
            75: [ 4.16, 4.98, 5.47, 5.68, 5.86, 5.98, 6.1 ],
            90: [ 4.38, 5.25, 5.68, 5.94, 6.07, 6.17, 6.44 ],
            110: [ 4.32, 5.21, 5.66, 5.96, 6.25, 6.53, 6.83 ],
            120: [ 4.13, 5.04, 5.57, 5.87, 6.16, 6.47, 7.02 ],
            135: [ 3.65, 4.52, 5.31, 5.69, 5.97, 6.25, 6.86 ],
            150: [ 3.18, 4.03, 4.8, 5.42, 5.75, 6.01, 6.58 ],
            runAngles: [ 6, 8, 10, 12, 14, 16, 20 ],
            runVMG: [ 6, 8, 10, 12, 14, 16, 20 ],
        }
    }
    const rows = polarCsv.split(/\r?\n/).map(row => row.split(CSV_SEPARATOR))

    const tws = resolveTws(rows)
    const boatSpeeds = resolveBoatSpeeds(rows)
    const beatAngles = resolveBeatAngles(boatSpeeds)(rows)
    const beatVMG = resolveBeatVMG(boatSpeeds)(rows)
    const runAngles = resolveRunAngles(boatSpeeds)(rows)
    const runVMG = resolveRunVMG(boatSpeeds)(rows)
    return {
        tws,
        beatAngles,
        beatVMG,
        ...boatSpeeds,
        runAngles,
        runVMG,
    }
}
const resolveTws = (rows: string[][]) => {
    const [, ...tws] = rows[0]
    return tws.map(string2float)
}
const resolveBoatSpeeds = (rows: string[][]): {[angle: string]: number[]} => {
    return rows
        .filter(row => string2float(row[0]))
        .filter(not(isSparseRow))
        .map(row => row.map(string2float))
        .reduce(
            (boatSpeeds, row) => {
                const [tws, ...speeds] = row
                return {
                    ...boatSpeeds,
                    [int2string(tws)]: speeds
                }
            },
            {}
        )
}
const isSparseRow = (row: string[]) => {
    const [angle, ...values] = row
    const isIt = truthy(angle) && values.map(string2float).filter(truthy).length == 1
    return isIt
}
const isBeatRow = (minBoatSpeedAngle: number) => (row: string[]) =>  string2float(row[0]) < minBoatSpeedAngle
const isRunRow = (maxBoatSpeedAngle: number) => (row: string[]) =>  maxBoatSpeedAngle < string2float(row[0])

const resolveBeatAngles = (boatSpeeds: { [tws: string]: number[] }) => (rows: string[][]) => {
    const minBoatSpeedAngle = Math.min(...Object.keys(boatSpeeds).map(string2float))
    const twsCount = boatSpeeds[minBoatSpeedAngle].length
    const beatRows = rows.filter(isSparseRow).filter(isBeatRow(minBoatSpeedAngle))
    return beatRows.reduce(
        (beatAngles, row) => {
            const [angle, ...values] = row
            const index = values.map(string2float).findIndex(truthy)
            beatAngles[index] = string2float(angle)
            return beatAngles
        },
        new Array(twsCount) as number[]
    )
}
const resolveBeatVMG = (boatSpeeds: {[tws: string]: number[]}) => (rows: string[][]) => {
    const minBoatSpeedAngle = Math.min(...Object.keys(boatSpeeds).map(string2float))
    const twsCount = boatSpeeds[minBoatSpeedAngle].length
    const beatRows = rows.filter(isSparseRow).filter(isBeatRow(minBoatSpeedAngle))
    return beatRows.reduce(
        (beatVMG, row) => {
            const [, ...values] = row
            const index = values.map(string2float).findIndex(truthy)
            beatVMG[index] = string2float(values[index])
            return beatVMG
        },
        new Array(twsCount) as number[]
    )
}
const resolveRunAngles = (boatSpeeds: {[tws: string]: number[]}) => (rows: string[][]) => {
    const maxBoatSpeedAngle = Math.max(...Object.keys(boatSpeeds).map(string2float))
    const twsCount = boatSpeeds[maxBoatSpeedAngle].length
    const beatRows = rows.filter(isSparseRow).filter(isRunRow(maxBoatSpeedAngle))
    return beatRows.reduce(
        (runAngles, row) => {
            const [angle, ...values] = row
            const index = values.map(string2float).findIndex(truthy)
            runAngles[index] = string2float(angle)
            return runAngles
        },
        new Array(twsCount) as number[]
    )
}
const resolveRunVMG = (boatSpeeds: {[tws: string]: number[]}) => (rows: string[][]) => {
    const maxBoatSpeedAngle = Math.max(...Object.keys(boatSpeeds).map(string2float))
    const twsCount = boatSpeeds[maxBoatSpeedAngle].length
    const beatRows = rows.filter(isSparseRow).filter(isRunRow(maxBoatSpeedAngle))
    return beatRows.reduce(
        (runVMG, row) => {
            const [, ...values] = row
            const index = values.map(string2float).findIndex(truthy)
            runVMG[index] = string2float(values[index])
            return runVMG
        },
        new Array(twsCount) as number[]
    )
}

export const fieldName = (
    angle: number | 'beatAngles' | 'beatVMG' | 'runAngles' | 'runVMG',
    knots: number
) => `polar:${angle}:${knots}`

export const formData2polarCsv = (formData: FormData): string => {
    let twsSet = new Set<number>()
    let anglesSet = new Set<string>()
    formData.forEach(
        (value, key) => {
            console.log(key, value)
            const [type, angle, tws] = key.split(':')
            if (type !== 'polar') return
            console.log(`add to tws`, key, tws)
            twsSet.add(string2float(tws))
            anglesSet.add(angle)
        }
    )
    const tws = sort(cmpNumber)([...twsSet])
    console.log(`TWS set`, twsSet)
    console.log(`TWS`, tws)
    const twsCount = tws.length
    const colsByTws = tws.reduce(
        (colsByTws, tws, col) => {
            colsByTws[tws] = col
            return colsByTws
        },
        {} as {[tws: string]: number}
    )
    let shipPolar_ = {} as {[angle:string]: number[]}
    formData.forEach(
        (value, key) => {
            console.log(key, value)
            const [type, angle, tws] = key.split(':')
            if (type !== 'polar') return
            if (undefined === shipPolar_[angle]) {
                shipPolar_[angle] = new Array(twsCount).fill(0)
            }
            shipPolar_[angle][colsByTws[tws]] = string2float(value.toString())
        }
    )
    const shipPolar = shipPolar_ as ShipPolar
    console.log(`shipPolar`, shipPolar_)

    const csvA = [
        ['twa/tws', ...tws],
        ...shipPolar.beatAngles.map(
            (angle, idx) => {
                let a = new Array(twsCount).fill('0')
                a[idx] = shipPolar.beatVMG[idx]
                return [`${angle}`, ...a]
            }
        ),
        ...sort(cmpNumber)(Object.keys(shipPolar).map(string2float).filter(truthy)).map(
            angle => [ `${angle}`, ...shipPolar[angle]]
        ),
        ...shipPolar.runAngles.map(
            (angle, idx) => {
                let a = new Array(twsCount).fill('0')
                a[idx] = shipPolar.runVMG[idx]
                return [`${angle}`, ...a]
            }
        )
    ]
    const csv = csvA.map(row => row.join(CSV_SEPARATOR)).join(`\n`)
    return csv
}
import { cmpNumber, equal, head, int2string, not, sort, string2float, truthy } from "./fp"
import { absDiff, } from "./math"

const CSV_SEPARATOR = ';'

export type ShipPolar = {
    tws: number[]
    twa: number[]
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
            twa: [ 52, 60, 75, 90, 110, 120, 135, 150 ],
            beatAngles: [ 45, 45, 45, 45, 45, 45, 45 ],
            beatVMG: [ 0, 0, 0, 0, 0, 0, 0, ],
            52: [ 0, 0, 0, 0, 0, 0, 0 ],
            60: [ 0, 0, 0, 0, 0, 0, 0 ],
            75: [ 0, 0, 0, 0, 0, 0, 0 ],
            90: [ 0, 0, 0, 0, 0, 0, 0 ],
            110: [ 0, 0, 0, 0, 0, 0, 0 ],
            120: [ 0, 0, 0, 0, 0, 0, 0 ],
            135: [ 0, 0, 0, 0, 0, 0, 0 ],
            150: [ 0, 0, 0, 0, 0, 0, 0 ],
            runAngles: [ 160, 160, 160, 160, 160, 160, 160 ],
            runVMG: [ 0, 0, 0, 0, 0, 0, 0 ],
        }
    }
    const rows = polarCsv.split(/\r?\n/).map(row => row.split(CSV_SEPARATOR))

    const tws = resolveTws(rows)
    const twa = resolveTwa(rows)
    const boatSpeeds = resolveBoatSpeeds(rows)
    const beatAngles = resolveBeatAngles(boatSpeeds)(rows)
    const beatVMG = resolveBeatVMG(boatSpeeds)(rows)
    const runAngles = resolveRunAngles(boatSpeeds)(rows)
    console.log(`runAngles`, runAngles)
    const runVMG = resolveRunVMG(boatSpeeds)(rows)
    console.log(`runVMG`, runVMG)
    return {
        twa,
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
const resolveTwa = (rows: string[][]) => sort(cmpNumber)(rows.map(head).map(string2float).filter(truthy))

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
const isBeatRow = (row: string[]) =>  string2float(row[0]) < 60
const isRunRow = (row: string[]) =>  100 < string2float(row[0])

const resolveBeatAngles = (boatSpeeds: { [tws: string]: number[] }) => (rows: string[][]) => {
    const minBoatSpeedAngle = Math.min(...Object.keys(boatSpeeds).map(string2float))
    const twsCount = boatSpeeds[minBoatSpeedAngle].length
    const beatRows = rows.filter(isSparseRow).filter(isBeatRow)
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
    const beatRows = rows.filter(isSparseRow).filter(isBeatRow)
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
    const runRows = rows.filter(isSparseRow).filter(isRunRow)
    console.log(`runRows`, runRows)
    return runRows.reduce(
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
    const runRows = rows.filter(isSparseRow).filter(isRunRow)
    return runRows.reduce(
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

export const getTwsCol = (shipPolar: ShipPolar) => (knots: number) => {
    const diffs = shipPolar.tws.map(absDiff(knots))
    const minDiff = Math.min(...diffs)
    return diffs.findIndex(equal(minDiff))
}
export const getTwaRow = (shipPolar: ShipPolar) => (angle: number) => {
    const diffs = shipPolar.twa.map(absDiff(angle))
    const minDiff = Math.min(...diffs)
    return diffs.findIndex(equal(minDiff))
}

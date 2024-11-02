import { Radians } from "./angles"
import { roundTo } from "./math"

export type Vector = {
    x: number
    y: number
}
export const makeVector = (x: number, y: number) => ({ x, y })
export const vectorAdd = (v1: Vector, v2: Vector): Vector => ({
    x: v1.x + v2.x,
    y: v1.y + v2.y,
})
export const vectorScale = (s: number) => (v: Vector): Vector => ({ x: s * v.x, y: s * v.y})
export const vectorMagnitude = ({
    x, y
}: Vector): number => Math.sqrt(x * x + y * y)
export const unitVector = (v: Vector): Vector => vectorScale(1 / vectorMagnitude(v))(v)
export const vectorAngle = ({x, y}: Vector): Radians => Math.atan2(y, x)
export const vectorRotate = (θ: Radians) => ({ x, y }: Vector) => {
    const sin = Math.sin(θ)
    const cos = Math.cos(θ)
    return {
        x: x * cos - y * sin,
        y: x * sin + y * cos,
    }
}
export const angle2unitVector = (θ: Radians) => makeVector(roundTo(8)(Math.cos(θ)), roundTo(8)(Math.sin(θ)))
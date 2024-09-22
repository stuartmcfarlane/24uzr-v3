export type Vector = {
    x: number
    y: number
}
export const vectorAdd = (v1: Vector, v2: Vector): Vector => ({
    x: v1.x + v2.x,
    y: v1.y + v2.y,
})
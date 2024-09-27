export const indexBy = <T>(k: (keyof T)) => (array: T[]) => {
    return array.reduce(
        (indexBy: { [k in keyof T]: T }, o: T) => {
            // @ts-expect-error
            indexBy[o[k]] = o
            return indexBy
        },
        {} as { [k in keyof T]: T }
    )
}
export const indexByHash = <T>(fn: (t: T) => string) => (array: T[]) => (
    array.reduce(
        (indexBy: { [k: string]: T }, o: T) => {
            indexBy[fn(o)] = o
            return indexBy
        },
        {} as { [k: string]: T }
    )
)

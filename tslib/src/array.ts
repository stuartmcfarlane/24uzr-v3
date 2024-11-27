import { Predicate } from "./fp"

const _splitArray = <T>(pred: Predicate<T>) => (a: T[]): [T[], T[]] => a.reduce(
    ([has, hasNot]: [T[], T[]], o: T): [T[], T[]] => {
        const yes = pred(o)
        return [
            [...(yes ? [...(has || []), o] : has)],
            [...(!yes ? [...(hasNot || []), o] : hasNot)],
        ]
    },
    [[],[]] as [T[], T[]]
)
export const splitArray = <T>(...predicates: Predicate<T>[]) => (a: T[]): T[][] => {
    if (predicates.length === 0) return [a]
    if (a.length === 0) return [[],...splitArray(...predicates.slice(1))([])]
    const [yes, no] = _splitArray(predicates[0])(a)
    const splits = [yes, ...splitArray(...predicates.slice(1))(no)]
    return splits
}
export const reverse = <T>(xs: T[]) => [...xs].reverse()

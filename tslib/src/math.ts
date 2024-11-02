export const realCmp = (ε: number) => (a: number, b: number): number => (
    Math.abs(a - b) < ε
        ? 0
        : a < b
            ? 1
            : -1
)
export const realEq = (ε: number) => (a: number, b: number): boolean => (
    0 === realCmp(ε)(a, b)
)
export const absDiff = (a: number) => (b: number) => Math.abs(a - b)
export const roundTo = (precision: number) => (x: number): number => {
    const pow10 = 10 ** precision
    return Math.round(x * pow10) / pow10
}

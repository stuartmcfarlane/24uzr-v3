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

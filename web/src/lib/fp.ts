// Drop N entries from array T
type Drop<N extends number, T extends any[], I extends any[] = []> =
    Length<I> extends N
    ? T
    : Drop<N, Tail<T>, Prepend<Head<T>, I>>;

// Add element E to array A (i.e Prepend<0, [1, 2]> = [0, 1, 2])
type Prepend<E, A extends any[]> = [E, ...A];

// Get the tail of the array, i.e Tail<[0, 1, 2]> = [1, 2]
type Tail<A extends any[]> = A extends [any] ? [] : A extends [any, ...infer T] ? T : never;

// Get the head of the array, i.e Head<[0, 1, 2]> = 0
type Head<A extends any[]> = A extends [infer H] ? H : A extends [infer H, ...any] ? H : never;

// Get the length of an array
type Length<T extends any[]> = T['length'];

// Use type X if X is assignable to Y, otherwise Y
type Cast<X, Y> = X extends Y ? X : Y;

// Curry a function
type Curry<P extends any[], R> =
    <T extends any[]>(...args: Cast<T, Partial<P>>) =>
        Drop<Length<T>, P> extends [any, ...any[]]
        ? Curry<Cast<Drop<Length<T>, P>, any[]>, R>
        : R;

function curry<P extends any[], R>(fn: (...args: P) => R) {
    return ((...args: any[]) => {
        if (args.length >= fn.length) {
            return (fn as Function)(...args) as R;
        }

        return ((...more: any[]) => (curry(fn) as Function)(...args, ...more));
    }) as unknown as Curry<P, R>;
}

const allOf = (...fns: Function[]) => (v: any) => fns.reduce((pp, fn) => pp && fn(v), true)

export const idIs = (needle: number) => (o: { id: number }): boolean => needle === o.id
export const nameIs = (needle: string) => (o: { name: string }): boolean => needle === o.id
export const idIsNot = (needle: number) => (o: { id: number }): boolean => needle !== o.id
export const and = allOf
export const project = <O, K extends keyof O>(k: K) => (o: O) => o[k]
export const unique = <T>(array: T[]) => {
    const set = new Set<T>(array)
    return [...set]
}
export const uniqueHash = <T>(hash: (t: T) => string, array: T[]) => {
    const map = new Map<string, T>()
    array.forEach(a => map.set(hash(a), a))
    let uniq: T[] = []
    map.forEach(a => uniq.push(a))
    return uniq
}
export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
}
export const truthy = (a:any) => !!a
export const withField = (o1: {}) => (o2: {}) => ({ ...o2, ...o1})
export {
    curry,
}
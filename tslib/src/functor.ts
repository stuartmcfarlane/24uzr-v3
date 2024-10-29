
export interface Functor<A> {
    map<B>(fn: (a: A) => B): Functor<B>
    reduce<B>(fn:(a: A, b?: B) => B): B
}

export const map = <A, B>(fn: (a: A) => B) => (as: Functor<A>) => as.map(fn)
export const reduce = <A, B>(fn: (a: A, b?: B) => B) => (as: Functor<A>) => as.reduce(fn)

export class ArrayFunctor<A>
    extends Array<A>
    implements Functor<A> { }

export class MapFunctor<K, A>
    extends Map<K, A>
    implements Functor<A>
{
    map<B>(fn: (a: A) => B): MapFunctor<K, B> {
        return new MapFunctor<K, B>(
            [...this.entries()].map(
                ([key, value]: [K, A]) => {
                    return [
                        key,
                        fn(value)
                    ] as [K, B]
                }
            )
        )
    }
    reduce<B>(fn: (a: A, b?: B) => B): B {
        const [head, ...tail] = [...this.values()]
        return tail.reduce<B>(
            (b: B, a: A) => {
                return fn(a, b)
            },
            fn(head)
        )
    }
}

export class SetFunctor<A>
    extends Set<A>
    implements Functor<A>
{
    map<B>(fn: (a: A) => B): SetFunctor<B> {
        return new SetFunctor<B>(
            [...this.values()].map(
                (value: A) => {
                    return fn(value)
                }
            )
        )
    }
    reduce<B>(fn: (a: A, b?: B) => B): B {
        const [head, ...tail] = [...this.values()]
        return tail.reduce<B>(
            (b: B, a: A) => {
                return fn(a, b)
            },
            fn(head)
        )
    }
}


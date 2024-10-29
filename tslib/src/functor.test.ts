import { describe, expect, it } from '@jest/globals'
import { reduce, map, MapFunctor, SetFunctor, ArrayFunctor } from './functor';

describe('Functor', () => {
    describe(`array is already functor`, () => {
        it('should map (x=>x+1)([1, 2, 3] to [2, 3, 4]', () => {
            const a = map((x: number) => x+1)([1, 2, 3])
            expect(a).toStrictEqual([2, 3, 4])
        })
        it('should reduce (x=>x+1)([1, 2, 3] to 6', () => {
            const a = reduce((a: number, b: number = 0) => a+b)([1, 2, 3])
            expect(a).toBe(6)
        })
    })
    describe(`array functor`, () => {
        it('should map (x=>x+1)([1, 2, 3] to [2, 3, 4]', () => {
            const a = map((x: number) => x+1)(new ArrayFunctor(1, 2, 3))
            expect(a).toStrictEqual([2, 3, 4])
        })
        it('should reduce (x=>x+1)([1, 2, 3] to 6', () => {
            const a = reduce((a: number, b: number = 0) => a+b)(new ArrayFunctor(1, 2, 3))
            expect(a).toBe(6)
        })
    })
    describe(`map functor`, () => {
        it('should map (x=>x+1)({"a": 1, "b": 2, "b": 3} to {"a": 2, "b": 3, "b": 4}', () => {
            const a = map((x: number) => x+1)(new MapFunctor<string, number>([["a", 1], ["b", 2], ["b", 3]]))
            expect(a).toStrictEqual(new MapFunctor<string, number>([["a", 2], ["b", 3], ["b", 4]]))
        })
        it('should reduce (x=>x+1)({"a": 1, "b": 2, "b": 3} to 6', () => {
            const a = reduce((a: number, b: number = 0) => a+b)(new MapFunctor<string, number>([["a", 1], ["b", 2], ["c", 3]]))
            expect(a).toBe(6)
        })
    })
    describe(`set functor`, () => {
        it('should map (x=>x+1)({1, 2, 3} to {2, 3, 4}', () => {
            const a = map((x: number) => x+1)(new SetFunctor<number>([1, 2, 3]))
            expect(a).toStrictEqual(new SetFunctor<number>([2, 3, 4]))
        })
        it('should reduce (x=>x+1)({1, 2, 3} to 6', () => {
            const a = reduce((a: number, b: number = 0) => a+b)(new SetFunctor<number>([1, 2, 3]))
            expect(a).toBe(6)
        })
    })
})

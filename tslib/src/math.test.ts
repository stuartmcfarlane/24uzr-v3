import { describe, expect, it } from '@jest/globals'
import { realCmp, roundTo } from '../dist'

describe('realCmp', () => {
    it('gives > 0 for a < b', () => {
        expect(realCmp(1)(-1, 1)).toBeGreaterThan(0)
    })
    it('gives < 0 for a > b', () => {
        expect(realCmp(1)(1, -1)).toBeLessThan(0)
    })
    it('gives 0 for a == b', () => {
        expect(realCmp(1)(1, 1)).toBe(0)
    })
})
describe('roundTo', () => {
    it('gives 0.001 for .0012', () => {
        expect(roundTo(3)(0.0012)).toBe(0.001)
    })
    it('gives 0.002 for .0015', () => {
        expect(roundTo(3)(0.0015)).toBe(0.002)
    })
})

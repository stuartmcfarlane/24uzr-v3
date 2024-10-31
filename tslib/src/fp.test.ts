import { describe, expect, it } from '@jest/globals';
import { seq } from './fp';
describe('seq', () => {
    it('makes 0..12', () => {
        expect(seq(0, 12)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
    it('makes 1..12', () => {
        expect(seq(1, 12)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
});

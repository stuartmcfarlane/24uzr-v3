import {describe, expect, test} from '@jest/globals';
import { makeVector } from './vector';

test("can make a vector", () => {
    expect(makeVector(0, 0)).toStrictEqual({x: 0, y: 0})
})
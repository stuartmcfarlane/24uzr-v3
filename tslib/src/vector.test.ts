import {describe, expect, it, test} from '@jest/globals';
import { makeVector, vectorAngle, vectorMagnitude } from '../dist';

describe("makeVector", () => {
    it("makes a vector", () => {
        expect(makeVector(0, 0)).toStrictEqual({x: 0, y: 0})
    })
})

describe("vectorAngle", ()=> {
    it("gives 0 for [1, 0]", () => {
        expect(vectorAngle(makeVector(1, 0))).toEqual(0)
    })
    it("gives π/2 for [0, 1]", () => {
        expect(vectorAngle(makeVector(0, 1))).toEqual(Math.PI/2)
    })
    it("gives π for [-1, 0]", () => {
        expect(vectorAngle(makeVector(-1, 0))).toEqual(Math.PI)
    })
    it("gives -π/2 for [0, -1]", () => {
        expect(vectorAngle(makeVector(0, -1))).toEqual(-Math.PI/2)
    })
})

describe("vectorMagnitude", () => {
    it("gives 1 for [0, 1]", () => {
        expect(vectorMagnitude(makeVector(1, 0))).toEqual(1)
    })
    it("gives √2 for [1, 1]", () => {
        expect(vectorMagnitude(makeVector(1, 1))).toEqual(Math.SQRT2)
    })
})
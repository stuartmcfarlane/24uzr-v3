import { describe, expect, it } from '@jest/globals';
import { angle2unitVector, degrees2radians, vectorRotate, wind2degrees, wind2knots, wind2vector } from '../dist';
import { makeVector } from '../dist';

const π = Math.PI

const northWind16 = makeVector(0, -8.23111)
const westWind16 = vectorRotate(π/2)(northWind16)
const southwestWind16 = vectorRotate(3*π/4)(northWind16)
const southWind16 = vectorRotate(π)(northWind16)
const eastWind16 = vectorRotate(3*π/2)(northWind16)

describe('wind2vector', () => {
  it('gives [0, -1] for north wind', ()=> {
    expect(wind2vector({u: 0, v: -1})).toStrictEqual(makeVector(0, -1))
  })
  it('gives [-1, 0] for east wind', ()=> {
    expect(wind2vector({u: -1, v: 0})).toStrictEqual(makeVector(-1, 0))
  })
  it('gives [0, 1] for south wind', ()=> {
    expect(wind2vector({u: 0, v: 1})).toStrictEqual(makeVector(0, 1))
  })
  it('gives [1, 0] for west wind', ()=> {
    expect(wind2vector({u: 1, v: 0})).toStrictEqual(makeVector(1, 0))
  })
})

describe('wind2degrees', () => {
  it('gives 0 for north wind', ()=> {
    expect(wind2degrees(northWind16)).toBe(0)
  })
  it('gives 90 for east wind', ()=> {
    expect(wind2degrees(eastWind16)).toBe(90)
  })
  it('gives 180 for south wind', ()=> {
    expect(wind2degrees(southWind16)).toBe(180)
  })
  it('gives 270 for west wind', ()=> {
    expect(wind2degrees(westWind16)).toBe(270)
  })
  it('gives 225 for southwest wind', ()=> {
    expect(wind2degrees(southwestWind16)).toBe(225)
  })
})
describe('wind2knots', () => {
  it('gives 16 for north wind', ()=> {
    expect(wind2knots(northWind16)).toBe(16)
  })
  it('gives 16 for east wind', ()=> {
    expect(wind2knots(eastWind16)).toBe(16)
  })
  it('gives 16 for south wind', ()=> {
    expect(wind2knots(southWind16)).toBe(16)
  })
  it('gives 16 for west wind', ()=> {
    expect(wind2knots(westWind16)).toBe(16)
  })
  it('gives 16 for southwest wind', ()=> {
    expect(wind2knots(southwestWind16)).toBe(16)
  })
})

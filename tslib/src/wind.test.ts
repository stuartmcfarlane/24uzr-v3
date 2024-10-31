import { describe, expect, it } from '@jest/globals';
import { wind2degrees } from '../dist';
import { makeVector } from '../dist';

// describe('wind2resolution', () => {
//   it('', ()=> {
  
// })


// describe('indexWindByTimestamp', () => {
//   it('', ()=> {
//   })
// })
// describe('singleWind2bulkWind', () => {
//   it('', ()=> {
//   })
// })
// describe('bulkWind2indexedWind', () => {
//   it('', ()=> {
//   })
// })
// describe('singleWind2indexedWind', () => {
//   it('', ()=> {
//   })
// })
// describe('windAtLocation', () => {
//   it('', ()=> {
//   })
// })
// describe('windAtTime', () => {
//   it('', ()=> {
//   })
// })
// describe('windAtTimeAndLocation', () => {
//   it('', ()=> {
//   })
// })

describe('wind2degrees', () => {
  it('gives 0 for north wind', ()=> {
    expect(wind2degrees(makeVector(0, -1))).toBe(0)
  })
  it('gives 90 for east wind', ()=> {
    expect(wind2degrees(makeVector(-1, 0))).toBe(90)
  })
  it('gives 180 for south wind', ()=> {
    expect(wind2degrees(makeVector(0, 1))).toBe(180)
  })
  it('gives 270 for west wind', ()=> {
    expect(wind2degrees(makeVector(1, 0))).toBe(270)
  })
})

import { describe, expect, it } from '@jest/globals';
import { timestampIs } from './wind';
import { wind2degrees } from './wind';
import { makeVector } from './vector';

// describe('wind2resolution', () => {
//   it('', ()=> {
  
// })

const timestampString = '2024-10-25T13:34:00.848Z'
const otherTimestampString = '2024-11-25T13:34:00.848Z'
const timestampDate = new Date(timestampString)
const withTimestampDate = {
  timestamp: timestampDate
}
const withTimestampString = {
  timestamp: timestampString
}

describe('timestampIs', () => {
  it('compares equal string', () => {
    expect(timestampIs(timestampString)(withTimestampString)).toBe(true)  
  })
  it('compares equal date', () => {
    expect(timestampIs(timestampDate)(withTimestampDate)).toBe(true)  
  })
  it('compares equal date / string', () => {
    expect(timestampIs(timestampDate)(withTimestampString)).toBe(true)  
  })
  it('compares equal string / date', () => {
    expect(timestampIs(timestampString)(withTimestampDate)).toBe(true)  
  })
  it('compares unequal', () => {
    expect(timestampIs(otherTimestampString)(withTimestampDate)).toBe(false)  
  })
})

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

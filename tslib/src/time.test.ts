import { describe, expect, it } from '@jest/globals';
import { timestampIs } from '../dist';

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

import { describe, expect, it } from '@jest/globals';
import { degrees2radians, makeVector, radians2degrees, simplifyDegrees, simplifyRadians, vectorAngle } from '../dist';

describe('simplifyDegrees', () => {
    it('-90 is 270', () => {
        expect(simplifyDegrees(-90)).toBe(270)
    })
    it('90 is 90', () => {
        expect(simplifyDegrees(90)).toBe(90)
    })
    it('405 is 45', () => {
        expect(simplifyDegrees(405)).toBe(45)
    })
})
describe('simplifyRadians', () => {
    it('-π/2 is 3π/2', () => {
        expect(simplifyRadians(-Math.PI/2)).toBe(3*Math.PI/2)
    })
    it('π/2 is π/2', () => {
        expect(simplifyRadians(Math.PI/2)).toBe(Math.PI/2)
    })
    it('5π/2 is π/2', () => {
        expect(simplifyRadians(5*Math.PI/2)).toBe(Math.PI/2)
    })
})
describe('radians2degrees', () => {
    it('π/2 is 0', () => {
        expect(radians2degrees(Math.PI/2)).toBe(0)
    })
    it('0 is 90', () => {
        expect(radians2degrees(0)).toBe(90)
    })
    it('3π/2 is 180', () => {
        expect(radians2degrees(3*Math.PI/2)).toBe(180)
    })
    it('π is 270', () => {
        expect(radians2degrees(Math.PI)).toBe(270)
    })
})
describe('degrees2radians', () => {
    it('north is π/2', () => {
        expect(degrees2radians(0)).toBe(Math.PI/2)
    })
    it('east is 0', () => {
        expect(degrees2radians(90)).toBe(0)
    })
    it('west is π', () => {
        expect(degrees2radians(270)).toBe(Math.PI)
    })
    it('south is 3π/2', () => {
        expect(degrees2radians(180)).toBe(3*Math.PI/2)
    })
})
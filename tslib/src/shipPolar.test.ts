import { calcTwa, fieldName, getTwaRow, getTwsCol, parseShipPolar, shipPolarOrc2csv } from "../dist";
import { describe, expect, it } from '@jest/globals';
import { makeVector, vectorAngle } from "../dist";
import { radians2degrees } from '../dist';

const csv = [
    "twa/tws;6;8;10;12;14;16;20;24",
    "43.4;3.07;0;0;0;0;0;0;0",
    "41.5;0;3.67;0;0;0;0;0;0",
    "39.7;0;0;4.08;0;0;0;0;0",
    "38.4;0;0;0;4.33;0;0;0;0",
    "38.1;0;0;0;0;4.4;0;0;0",
    "38.2;0;0;0;0;0;4.42;0;0",
    "39.5;0;0;0;0;0;0;4.37;0",
    "42.6;0;0;0;0;0;0;0;4.16",
    "52;4.67;5.43;5.82;6.04;6.14;6.18;6.21;6.14",
    "60;4.91;5.61;5.96;6.17;6.31;6.37;6.45;6.43",
    "75;5.05;5.7;6.06;6.32;6.54;6.69;6.86;6.94",
    "90;4.96;5.67;6.13;6.44;6.63;6.87;7.24;7.49",
    "110;4.85;5.72;6.2;6.6;6.97;7.32;7.94;8.56",
    "120;4.7;5.6;6.11;6.51;6.9;7.32;8.6;10.03",
    "135;4.22;5.14;5.83;6.24;6.62;7.01;8.13;11.09",
    "150;3.55;4.53;5.33;5.91;6.28;6.63;7.4;9.22",
    "146.8;3.08;0;0;0;0;0;0;0",
    "151.4;0;3.92;0;0;0;0;0;0",
    "154.6;0;0;4.65;0;0;0;0;0",
    "168.2;0;0;0;5.31;0;0;0;0",
    "178.1;0;0;0;0;5.82;0;0;0",
    "178.6;0;0;0;0;0;6.17;0;0",
    "178.6;0;0;0;0;0;0;6.83;0",
    "138.8;0;0;0;0;0;0;0;7.99",
].join('\n')

const shipPolar = {
    '52': [ 4.67, 5.43, 5.82, 6.04, 6.14, 6.18, 6.21, 6.14 ],
    '60': [ 4.91, 5.61, 5.96, 6.17, 6.31, 6.37, 6.45, 6.43 ],
    '75': [ 5.05,  5.7, 6.06, 6.32, 6.54, 6.69, 6.86, 6.94 ],
    '90': [ 4.96, 5.67, 6.13, 6.44, 6.63, 6.87, 7.24, 7.49 ],
    '110': [ 4.85, 5.72,  6.2, 6.6, 6.97, 7.32, 7.94, 8.56 ],
    '120': [ 4.7,   5.6, 6.11, 6.51,   6.9, 7.32, 8.6, 10.03 ],
    '135': [ 4.22,  5.14, 5.83, 6.24,  6.62, 7.01, 8.13, 11.09 ],
    '150': [ 3.55, 4.53, 5.33, 5.91, 6.28, 6.63, 7.4, 9.22 ],
    twa: [ 52,  60,  75,  90, 110, 120, 135, 150 ],
    tws: [ 6,  8, 10, 12, 14, 16, 20, 24 ],
    beatAngles: [ 43.4, 41.5, 39.7, 38.4, 38.1, 38.2, 39.5, 42.6 ],
    beatVMG: [ 3.07, 3.67, 4.08, 4.33,  4.4, 4.42, 4.37, 4.16 ],
    runAngles: [ 146.8, 151.4, 154.6, 168.2, 178.1, 178.6, 178.6, 138.8 ],
    runVMG: [ 3.08, 3.92, 4.65, 5.31, 5.82, 6.17, 6.83, 7.99 ]
}

const shipPolarOrc = {
    '52': [ 4.67, 5.43, 5.82, 6.04, 6.14, 6.18, 6.21, 6.14 ],
    '60': [ 4.91, 5.61, 5.96, 6.17, 6.31, 6.37, 6.45, 6.43 ],
    '75': [ 5.05,  5.7, 6.06, 6.32, 6.54, 6.69, 6.86, 6.94 ],
    '90': [ 4.96, 5.67, 6.13, 6.44, 6.63, 6.87, 7.24, 7.49 ],
    '110': [ 4.85, 5.72,  6.2, 6.6, 6.97, 7.32, 7.94, 8.56 ],
    '120': [ 4.7,   5.6, 6.11, 6.51,   6.9, 7.32, 8.6, 10.03 ],
    '135': [ 4.22,  5.14, 5.83, 6.24,  6.62, 7.01, 8.13, 11.09 ],
    '150': [ 3.55, 4.53, 5.33, 5.91, 6.28, 6.63, 7.4, 9.22 ],
    angles: [ 52,  60,  75,  90, 110, 120, 135, 150 ],
    speeds: [6, 8, 10, 12, 14, 16, 20, 24],
    beat_angle: [ 43.4, 41.5, 39.7, 38.4, 38.1, 38.2, 39.5, 42.6 ],
    beat_vmg: [ 3.07, 3.67, 4.08, 4.33,  4.4, 4.42, 4.37, 4.16 ],
    run_angle: [ 146.8, 151.4, 154.6, 168.2, 178.1, 178.6, 178.6, 138.8 ],
    run_vmg: [ 3.08, 3.92, 4.65, 5.31, 5.82, 6.17, 6.83, 7.99 ]
}

describe('parseShipPolar', () => {
    it('has twa', () => {
        expect(parseShipPolar(csv).twa).toStrictEqual(shipPolar.twa)
    })
    it('has tws', () => {
        expect(parseShipPolar(csv).tws).toStrictEqual(shipPolar.tws)
    })
    it('has beatAngles', () => {
        expect(parseShipPolar(csv).beatAngles).toStrictEqual(shipPolar.beatAngles)
    })
    it('has beatVMG', () => {
        expect(parseShipPolar(csv).beatVMG).toStrictEqual(shipPolar.beatVMG)
    })
    it('has angle 52', () => {
        expect(parseShipPolar(csv)[52]).toStrictEqual(shipPolar[52])
    })
    it('has angle 60', () => {
        expect(parseShipPolar(csv)[60]).toStrictEqual(shipPolar[60])
    })
    it('has angle 75', () => {
        expect(parseShipPolar(csv)[75]).toStrictEqual(shipPolar[75])
    })
    it('has angle 90', () => {
        expect(parseShipPolar(csv)[90]).toStrictEqual(shipPolar[90])
    })
    it('has angle 110', () => {
        expect(parseShipPolar(csv)[110]).toStrictEqual(shipPolar[110])
    })
    it('has angle 120', () => {
        expect(parseShipPolar(csv)[120]).toStrictEqual(shipPolar[120])
    })
    it('has angle 135', () => {
        expect(parseShipPolar(csv)[135]).toStrictEqual(shipPolar[135])
    })
    it('has angle 150', () => {
        expect(parseShipPolar(csv)[150]).toStrictEqual(shipPolar[150])
    })
    it('has runAngles', () => {
        expect(parseShipPolar(csv).runAngles).toStrictEqual(shipPolar.runAngles)
    })
    it('has runVMG', () => {
        expect(parseShipPolar(csv).runVMG).toStrictEqual(shipPolar.runVMG)
    })
})

describe('shipPolarOrc2csv', () => {
    it('produces correct csv', () => {
        expect(shipPolarOrc2csv(shipPolarOrc)).toBe(csv)
    })
})

describe('fieldName', () => {
    it('has correct format', () => {
        expect(fieldName(52, 6)).toBe('polar:52:6')
    })
})

describe('getTwsCol', () => {
    it('gives correct answer', () => {
        expect(getTwsCol(shipPolar)(6)).toBe(0)
    })
})

describe('getTwaRow', () => {
    it('give beatVMG for 6°', () => {
        expect(getTwaRow(shipPolar)(6)).toStrictEqual(shipPolar.beatVMG)
    })
    it('give runVMG for 170°', () => {
        expect(getTwaRow(shipPolar)(170)).toStrictEqual(shipPolar.runVMG)
    })
    it('give 52 row for 52°', () => {
        expect(getTwaRow(shipPolar)(52)).toStrictEqual(shipPolar[52])
    })
})

describe('calcTwa', () => {
    it('into the wind is 0', () => {
        expect(calcTwa(makeVector(1, 1), radians2degrees(vectorAngle(makeVector(-1, -1))))).toBe(0)
    })
    it('downwind is 180', () => {
        expect(calcTwa(makeVector(1, 1), radians2degrees(vectorAngle(makeVector(1, 1))))).toBe(180)
    })
    it('port reach is -90', () => {
        expect(calcTwa(makeVector(1, 1), radians2degrees(vectorAngle(makeVector(-1, 1))))).toBe(-90)
    })
    it('starboard reach is 90', () => {
        expect(calcTwa(makeVector(1, 1), radians2degrees(vectorAngle(makeVector(1, -1))))).toBe(90)
    })
})


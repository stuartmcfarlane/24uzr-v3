export const metersPerSecond2knots = (metersPerSecond: number) => metersPerSecond * 1.94384;
export const knots2metersPerSecond = (knots: number) => knots * 0.514444;

export const nM2meters = (nM: number) => 1852 * nM
export const meters2nM = (m: number) => m / 1852

export const radians2degrees = (radians: number) => radians * 180 / Math.PI
export const degrees2radians = (degrees: number) => Math.PI * degrees / 180

export type Degrees = number
export type Radians = number

const π = Math.PI

export const simplifyDegrees = (degrees: Degrees): Degrees => {
    return (
        degrees < 0
            ? simplifyDegrees(degrees + 360)
            : degrees % 360
        )
}

export const simplifyRadians = (radians: Radians): Radians => {
    return (
        radians < 0
            ? simplifyRadians(radians + 2 * π)
            : radians % (2 * π)
        )
}

export const radians2degrees = (radians: Radians): Degrees => simplifyDegrees(90 - radians * 180 / π)
export const degrees2radians = (degrees: Degrees): Radians => simplifyRadians(π/2 - degrees * π / 180)
import { radians2degrees, metersPerSecond2knots } from './conversions';
import { getTwaRow, getTwsCol, ShipPolar } from "./shipPolar";
import { Vector, vectorAngle, vectorMagnitude } from "./vector";

export const shipSpeed = (shipPolar: ShipPolar) => (heading: number, vWind: Vector): number => {
    const windAngle = radians2degrees(vectorAngle(vWind))
    const windKnots = metersPerSecond2knots(vectorMagnitude(vWind))

    const twa = windAngle - heading > 180 ? windAngle - heading - 180 : windAngle - heading

    const twsCol = getTwsCol(shipPolar)(windKnots)

    if (twa <= shipPolar.beatAngles[twsCol]) {
        return shipPolar.beatVMG[twsCol]
    }

    if (shipPolar.runAngles[twsCol] <= twa) {
        return shipPolar.runVMG[twsCol]
    }

    const twaRow = getTwaRow(shipPolar)(twa)

    return twaRow[twsCol]
}


import { Degrees } from './angles';
import { metersPerSecond2knots } from './conversions';
import { calcTwa, getTwaRow, getTwsCol, ShipPolar } from "./shipPolar";
import { Vector, vectorMagnitude } from "./vector";

export const shipSpeed = (shipPolar: ShipPolar) => (bearing: Degrees, vWind: Vector): number => {
    const windKnots = metersPerSecond2knots(vectorMagnitude(vWind))

    const twa = Math.abs(calcTwa(vWind, bearing))

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


import { knots2metersPerSecond } from 'tslib'
type RGBA = [number, number, number, number?]
export const rgba2string = ([r, g, b, a]: RGBA) => a === undefined ? `rgb(${r},${g},${b})` : `rgb(${r},${g},${b},${a})`
type Choice = [number, RGBA]
const pickColor =
    (choices: Choice[]) =>
        (key: number): RGBA | undefined => {
            const found = choices.findLast(
                choice => choice[0] < key
            )
            return found && found[1]
        }

export const knotsColorScale: Choice[] = [
    [1.5, [134, 163, 171]],
    [2.5,[126,152,188,256]],
    [4.12,[110,143,208,256]],
    [4.63,[110,143,208,256]],
    [6.17,[15,147,167,256]],
    [7.72,[15,147,167,256]],
    [9.26,[57,163,57,256]],
    [10.29,[57,163,57,256]],
    [11.83,[194,134,62,256]],
    [13.37,[194,134,63,256]],
    [14.92,[200,66,13,256]],
    [16.46,[200,66,13,256]],
    [18,[210,0,50,256]],
    [20.06,[215,0,50,256]],
    [21.6,[175,80,136]],
    [23.66,[175,80,136]],
    [25.21,[117,74,147]],
    [27.78,[117,74,147]],
    [29.32,[68,105,141,256]],
    [31.89,[68,105,141]],
    [33.44,[194,251,119,256]],
    [42.18,[194,251,119,256]],
    [43.72,[241,255,109,256]],
    [48.87,[241,255,109,256]],
    [50.41,[256,256,256,256]],
    [57.61,[256,256,256,256]],
    [59.16,[0,256,256,256]],
    [68.93,[0,256,256,256]],
    [69.44, [256, 37, 256, 256]]
]

const metersPerSecondColorScale = knotsColorScale.map(
    ([knots, rgb]: Choice) => [ knots2metersPerSecond(knots), rgb]
) as Choice[]
export const metersPerSecond2RGBA = pickColor(metersPerSecondColorScale)
import { fmtReal } from "tslib"

type ShipTwaIconProps = {
    twa: number
}

const ShipTwaIcon = (props: ShipTwaIconProps) => {
    const {
        twa,
    } = props
    return (
        <svg
            fill="#000000"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            xmlSpace="preserve"
        >
            <g transform={`rotate(${fmtReal(-twa)} 16 16)`}>
                <path
                    d="
                        M 16 4
                        C 12 8 8 24 14 28
                        L 18 28
                        C 24 24 20 8 16 4
                        Z
                    "
                    strokeWidth={1} stroke={'black'} vectorEffect="non-scaling-stroke" fill="white"
                />
                <g transform={`rotate(${fmtReal(Math.sign(twa) * Math.min(Math.abs(twa), 90))} 16 16)`}>
                    <line
                        x1="16"
                        y1="16"
                        x2="16"
                        y2="30"
                        stroke="black"
                        vectorEffect="non-scaling-stroke"
                    />
                </g>
            </g>
        </svg>        
    )
}
export default ShipTwaIcon
import { fmtReal } from "@/lib/graph"

export type MouseRegionProps = {
    point?: Point
    mark?: Point
}

const MouseRegion = (props: MouseRegionProps) => {
    const {
        point,
        mark,
    } = props
    if (!point || !mark) return <></>
    const { x: x1, y: y1 } = point
    const { x: x2, y: y2 } = mark
    const x = Math.min(x1, x2)
    const y = Math.min(y1, y2)
    const width = Math.abs(x2 - x1)
    const height = Math.abs(y2 - y1)
    return <>
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            stroke={'red'}
            fill="transparent"
            strokeWidth={1}
            strokeDasharray="4 2"
            vectorEffect="non-scaling-stroke"
        />
    </>
}

export default MouseRegion
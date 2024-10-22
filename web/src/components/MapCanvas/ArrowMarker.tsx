
type ArrowMarkerProps = {
    size?: number
    id?: string
}
const defaultProps: ArrowMarkerProps = {
    size: 4,
    id: 'arrow',
}

const ArrowMarker = (props: ArrowMarkerProps = defaultProps) => {
    const {
        size,
        id,
    } = {
        ...defaultProps,
        ...props
    }
    
    return (
        <marker
            id={id}
            viewBox={`0 0 10 10`}
            refX={`10`}
            refY={`5`}
            markerWidth={`${size}`}
            markerHeight={`${size}`}
            orient="auto-start-reverse">
            <path d={`M 0 0 L 10 5 L 0 10 z`}
                fill="context-stroke"
            />
        </marker>
    )
}

export default ArrowMarker
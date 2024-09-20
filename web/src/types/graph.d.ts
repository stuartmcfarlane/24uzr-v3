type MaybeLatLng = {
    lat: number | string
    lng: number | string
}
type LatLng = {
    lat: number
    lng: number
}
type Point = {
    x: number
    y: number
}
type Rect = [
    Point,
    Point
]
type ScaleToViewBoxProps = {
    viewBoxRect?: Rect
}
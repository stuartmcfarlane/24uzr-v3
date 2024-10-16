import { GeoJsonFeature, GeoJsonFeatureCollection, GeoJsonPosition } from './geojson.schema';
import { Region } from "./region.schema";

export const makeRegion = (p1: GeoJsonPosition, p2: GeoJsonPosition): Region => ({
    lng1: p1[0],
    lat1: p1[1],
    lng2: p2[0],
    lat2: p2[1],
})
export const extendRegion = (region: Region | undefined, position: GeoJsonPosition): Region => {
    if (!region) {
        return makeRegion(position, position)
    }
    const [lng, lat] = position
    return makeRegion(
        [
            Math.min(lng, region.lng1),
            Math.min(lat, region.lat1),
        ],
        [
            Math.max(lng, region.lng2),
            Math.max(lat, region.lat2),
        ],
    )
}
export const regionUnion = (r1: Region, r2: Region): Region => makeRegion(
    [
        Math.min(r1.lng1, r2.lng1),
        Math.min(r1.lat1, r2.lat1),
    ],
    [
        Math.max(r1.lng2, r2.lng2),
        Math.max(r1.lat2, r2.lat2),
    ],
)

export const geojson2region = (geojson: GeoJsonFeatureCollection | GeoJsonFeature): Region => {
    const features = 'features' in geojson ?  geojson.features : [geojson]
    return features.reduce(
        (region, feature) => regionUnion(
            feature.geometry.coordinates.reduce(
                (region, position) => extendRegion(region, position as number[]),
                makeRegion([Infinity, Infinity], [-Infinity, -Infinity])
            ),
            region
        ),
        makeRegion([Infinity, Infinity], [-Infinity, -Infinity])
    )
}

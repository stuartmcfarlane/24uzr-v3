import { GeoJsonFeature, GeoJsonFeatureCollection, GeoJsonLineString, GeoJsonMultiLineString, GeoJsonMultiPolygon, GeoJsonPolygon, GeoJsonPosition } from './geojson.schema';
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

const lineString2region = (coordinates: number[][]): Region => {
    return {
        lat1: Math.min(coordinates[0][1], coordinates[1][1]),
        lng1: Math.min(coordinates[0][0], coordinates[1][0]),
        lat2: Math.max(coordinates[0][1], coordinates[1][1]),
        lng2: Math.max(coordinates[0][0], coordinates[1][0]),
    }
}
const multiLineString2region = (coordinates: number[][][]): Region => {
    return coordinates.reduce(
        (region, lineString) => regionUnion(region, lineString2region(lineString)),
        makeRegion([Infinity, Infinity], [-Infinity, -Infinity])
    )
}
const polygon2region = multiLineString2region

const multiPolygon2region = (coordinates: number[][][][]): Region => {
    return coordinates.reduce(
        (region, polygon) => regionUnion(region, polygon2region(polygon)),
        makeRegion([Infinity, Infinity], [-Infinity, -Infinity])
    )
}

const feature2region = (feature: GeoJsonFeature): Region => {
    if (feature.geometry.type === "LineString") return lineString2region(feature.geometry.coordinates)
    if (feature.geometry.type === "MultiLineString") return multiLineString2region(feature.geometry.coordinates)
    if (feature.geometry.type === "Polygon") return polygon2region(feature.geometry.coordinates)
    if (feature.geometry.type === "MultiPolygon") return multiPolygon2region(feature.geometry.coordinates)
    return makeRegion([Infinity, Infinity], [-Infinity, -Infinity])
}

export const geojson2region = (geojson: GeoJsonFeatureCollection | GeoJsonFeature): Region => {
    const features = 'features' in geojson ? geojson.features : [geojson]
    return features
        .map(feature2region)
        .reduce(
            regionUnion,
            makeRegion([Infinity, Infinity], [-Infinity, -Infinity])
        )
}

import { z, object, number, literal } from 'zod'

/**
 * A Position is an array of coordinates.
 * https://tools.ietf.org/html/rfc7946#section-3.1.1
 * Array should contain between two and three elements.
 * The previous GeoJSON specification allowed more elements (e.g., which could be used to represent M values),
 * but the current specification only allows X, Y, and (optionally) Z to be defined.
 */
export const GeoJsonPositionSchema = number().array()
export type GeoJsonPosition = z.infer<typeof GeoJsonPositionSchema> // [number, number] | [number, number, number]

/**
 * Point geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.2
 */
export const GeoJsonPointSchema = object({
	type: literal('Point'),
	coordinates: GeoJsonPositionSchema,
})
export type GeoJsonPoint = z.infer<typeof GeoJsonPointSchema>

/**
 * MultiPoint geometry object.
 *  https://tools.ietf.org/html/rfc7946#section-3.1.3
 */
export const GeoJsonMultiPointSchema = object({
	type: literal('MultiPoint'),
	coordinates: GeoJsonPositionSchema.array(),
})
export type GeoJsonMultiPoint = z.infer<typeof GeoJsonMultiPointSchema>

/**
 * LineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.4
 */
export const GeoJsonLineStringSchema = object({
	type: literal('LineString'),
	coordinates: GeoJsonPositionSchema.array(),
})
export type GeoJsonLineString = z.infer<typeof GeoJsonLineStringSchema>

/**
 * MultiLineString geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.5
 */
export const GeoJsonMultiLineStringSchema = object({
	type: literal('MultiLineString'),
	coordinates: GeoJsonPositionSchema.array().array(),
})
export type GeoJsonMultiLineString = z.infer<typeof GeoJsonMultiLineStringSchema>

/**
 * Polygon geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.6
 */
export const GeoJsonPolygonSchema = object({
	type: literal('Polygon'),
	coordinates: GeoJsonPositionSchema.array().array(),
})
export type GeoJsonPolygon = z.infer<typeof GeoJsonPolygonSchema>

/**
 * FeatureCollection geometry object.
 * https://tools.ietf.org/html/rfc7946#section-3.1.7
 */
export const GeoJsonMultiPolygonSchema = object({
    type: literal('MultiPolygon'),
	coordinates: GeoJsonPositionSchema.array().array().array(),
})
export type GeoJsonMultiPolygon = z.infer<typeof GeoJsonMultiPolygonSchema>

/**
 * Feature geometry object.
 * https://tools.ietf.org/html/rfc7946
 */
export const GeoJsonGeometrySchema = z.union([
    GeoJsonPointSchema,
    GeoJsonMultiPointSchema,
    GeoJsonLineStringSchema,
    GeoJsonMultiLineStringSchema,
    GeoJsonPolygonSchema,
    GeoJsonMultiPolygonSchema,
    // GeoJsonGeometryCollectionSchema,
])
export type GeoJsonGeometry = z.infer<typeof GeoJsonGeometrySchema>

/**
 * GeometryCollection geometry object.
 * https://tools.ietf.org/html/rfc7946
 */
export const GeoJsonGeometryCollectionSchema = object({
    type: literal('GeometryCollection'),
    geometries: z.array(GeoJsonGeometrySchema),
})
export type GeoJsonGeometryCollection = z.infer<typeof GeoJsonGeometryCollectionSchema>

/**
 * Feature geometry object.
 * https://tools.ietf.org/html/rfc7946
 */
export const GeoJsonFeatureSchema = object({
    type: literal('Feature'),
    geometry: GeoJsonGeometrySchema,
    properties: object({}).passthrough().optional()
})
export type GeoJsonFeature = z.infer<typeof GeoJsonFeatureSchema>

/**
 * FeatureCollection geometry object.
 * https://tools.ietf.org/html/rfc7946
 */
export const GeoJsonFeatureCollectionSchema = object({
    type: literal('FeatureCollection').optional(),
	features: z.array(GeoJsonFeatureSchema),
})
export type GeoJsonFeatureCollection = z.infer<typeof GeoJsonFeatureCollectionSchema>

export const GeoJsonSchema = z.union([
    GeoJsonPositionSchema,
    GeoJsonPointSchema,
    GeoJsonMultiPointSchema,
    GeoJsonLineStringSchema,
    GeoJsonMultiLineStringSchema,
    GeoJsonPolygonSchema,
    GeoJsonMultiPolygonSchema,
    GeoJsonGeometrySchema,
    GeoJsonGeometryCollectionSchema,
    GeoJsonFeatureSchema,
    GeoJsonFeatureCollectionSchema,
])
export type GeoJson = z.infer<typeof GeoJsonSchema>

import { z } from "zod"
import { GeoJsonFeatureCollectionSchema, GeoJsonSchema } from "../../utils/zod-geojson"
import { buildJsonSchemas } from 'fastify-zod'

const geometryInput = {
    mapId: z.number(),
    name: z.string(),
    geojson: GeoJsonFeatureCollectionSchema,
}

const geometryGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
}

const createGeometrySchema = z.object({
    ...geometryInput
})

const updateGeometrySchema = createGeometrySchema

const geometryResponseSchema = z.object({
    ...geometryInput,
    ...geometryGenerated
})

export const GeometryIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateGeometryInput = z.infer<typeof createGeometrySchema>
export type UpdateGeometryInput = z.infer<typeof updateGeometrySchema>
export type GeometryIdParamInput = z.infer<typeof GeometryIdParamSchema>

export const { schemas: geometrySchemas, $ref } = buildJsonSchemas({
    createGeometrySchema,
    updateGeometrySchema,
    geometryResponseSchema,
}, {
    $id: 'geometrySchemas'
})
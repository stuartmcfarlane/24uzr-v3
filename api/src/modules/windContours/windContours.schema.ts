import { z } from "zod"
import { buildJsonSchemas } from 'fastify-zod'

export const ContourLevelsSchema = z.array(
    z.number()
)

export const ContourLineSchema = z.tuple([
    z.number(),
    z.number(),
])

export const ContourPolygonSchema = z.array(
    ContourLineSchema
)

export const ContourPolygonsSchema = z.array(
    ContourPolygonSchema
)

export const ContoursSchema = z.array(
    ContourPolygonsSchema
)

const windContoursInput = {
    timestamp: z.string(),
    lat1:       z.coerce.number(),
    lng1:       z.coerce.number(),
    lat2:       z.coerce.number(),
    lng2:       z.coerce.number(),
    levels:     ContourLevelsSchema,
    contours:   ContoursSchema,
}

const windContoursGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
}

export const createSingleWindContoursSchema = z.object({
    ...windContoursInput
})
export const createWindContoursSchema = z.union([
    createSingleWindContoursSchema,
    z.array(createSingleWindContoursSchema),
])

const updateWindContoursSchema = createWindContoursSchema

const windContoursResponseSchema = z.object({
    ...windContoursInput,
    ...windContoursGenerated
})

const windContoursListResponseSchema = z.array(
    z.object({
        id: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
        timestamp: z.string(),
        lat1:       z.coerce.number(),
        lng1:       z.coerce.number(),
        lat2:       z.coerce.number(),
        lng2:       z.coerce.number(),
    })
)

export const WindContoursIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateSingleWindContoursInput = z.infer<typeof createSingleWindContoursSchema>
export type CreateWindContoursInput = z.infer<typeof createWindContoursSchema>
export type UpdateWindContoursInput = z.infer<typeof updateWindContoursSchema>
export type WindContoursIdParamInput = z.infer<typeof WindContoursIdParamSchema>

export const { schemas: windContoursSchemas, $ref } = buildJsonSchemas({
    createWindContoursSchema,
    updateWindContoursSchema,
    windContoursResponseSchema,
    windContoursListResponseSchema,
}, {
    $id: 'windContoursSchemas'
})
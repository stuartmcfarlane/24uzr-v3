import { nullable, z } from "zod"
import { buildJsonSchemas } from 'fastify-zod'

const regionInput = {
    lat1: z.coerce.number(),    
    lng1: z.coerce.number(),    
    lat2: z.coerce.number(),    
    lng2: z.coerce.number(),    
}

const regionSchema = z.object(regionInput)

const windInput = {
    timestamp: z.string(),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    u: z.coerce.number(),
    v: z.coerce.number(),
}

const windGenerated = {
}

const createSingleWindSchema = z.object({
    ...windInput
})

const createSingleBulkWindSchema = z.object({
    timestamp: z.string(),
    data: z.array(
        z.object({
            lat: z.coerce.number(),
            lng: z.coerce.number(),
            u: z.coerce.number(),
            v: z.coerce.number(),
        })
    )
})
const createBulkWindSchema = z.union([
    createSingleBulkWindSchema,
    z.array(createSingleBulkWindSchema)
])

export const createWindSchema = z.union([
    createSingleWindSchema,
    createBulkWindSchema,
])

const updateWindSchema = z.object({
    ...windInput
})


const windResponseSchema = z.object({
    ...windInput,
    ...windGenerated
})

const windsResponseSchema = z.array(windResponseSchema)
const createWindResponseSchema = z.union([
    z.array(windResponseSchema),
    z.null()
])

export const getWindsQueryStringSchema = z.object({
    timestamp: z.string().optional(),
    from: z.string().optional(),
    until: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    lat1: z.number().optional(),
    lng1: z.number().optional(),
    lat2: z.number().optional(),
    lng2: z.number().optional(),
})

export type CreateBulkWindInput = z.infer<typeof createBulkWindSchema>
export type CreateSingleWindInput = z.infer<typeof createSingleWindSchema>
export type CreateWindInput = z.infer<typeof createWindSchema>
export type UpdateWindInput = z.infer<typeof updateWindSchema>
export type RegionSchema = z.infer<typeof regionSchema>

export const { schemas: windSchemas, $ref } = buildJsonSchemas({
    createWindSchema,
    createWindResponseSchema,
    updateWindSchema,
    windResponseSchema,
    windsResponseSchema,
    getWindsQueryStringSchema,
}, {
    $id: 'windSchemas'
})
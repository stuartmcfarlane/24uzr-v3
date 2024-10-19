import { z } from "zod"
import { buildJsonSchemas } from 'fastify-zod'

const shipInput = {
    name: z.string(),
    sailNumber: z.string(),
    ownerId: z.number(),
    polar: z.string(),
}

const shipGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
}

const createShipSchema = z.object({
    ...shipInput
})

const updateShipSchema = z.object({
    name: z.string().optional(),
    sailNumber: z.string().optional(),
    ownerId: z.number().optional(),
    polar: z.string().optional(),
})

const shipResponseSchema = z.object({
    ...shipInput,
    ...shipGenerated,
})

const shipsResponseSchema = z.array(
    z.object({
        ...shipInput,
        ...shipGenerated
    })
)

export const ShipIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateShipInput = z.infer<typeof createShipSchema>
export type UpdateShipInput = z.infer<typeof updateShipSchema>
export type ShipIdParamInput = z.infer<typeof ShipIdParamSchema>

export const { schemas: shipSchemas, $ref } = buildJsonSchemas({
    createShipSchema,
    updateShipSchema,
    shipResponseSchema,
    shipsResponseSchema,
}, {
    $id: 'shipSchemas'
})
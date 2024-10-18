import { z } from "zod"
import { buildJsonSchemas } from 'fastify-zod'
import { ShipPolarSchema } from "../../../prisma/generated/zod"

const shipInput = {
    name: z.string(),
    ownerId: z.number(),
}

const shipGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
}

const shipPolarOutput = ShipPolarSchema

const createShipSchema = z.object({
    ...shipInput
})

const updateShipSchema = createShipSchema

const shipResponseSchema = z.object({
    ...shipInput,
    ...shipGenerated,
    shipPolar: z.array(shipPolarOutput),
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
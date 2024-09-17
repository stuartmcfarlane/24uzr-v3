import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const shipInput = {
    name: z.string(),
    ownerId: z.number(),
};

const shipGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
};

const createShipSchema = z.object({
    ...shipInput
});

const updateShipSchema = createShipSchema;

const shipResponseSchema = z.object({
    ...shipInput,
    ...shipGenerated
});

const shipsResponseSchema = z.array(shipResponseSchema);

export type CreateShipInput = z.infer<typeof createShipSchema>;
export type UpdateShipInput = z.infer<typeof updateShipSchema>;

export const { schemas: shipSchemas, $ref } = buildJsonSchemas({
    createShipSchema,
    updateShipSchema,
    shipResponseSchema,
    shipsResponseSchema,
}, {
    $id: 'shipSchemas'
});
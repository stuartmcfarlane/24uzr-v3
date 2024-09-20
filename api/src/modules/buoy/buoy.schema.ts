import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const buoyInput = {
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
    mapId: z.number(),
};

const buoyGenerated = {
    id: z.number(),
};

const createBuoySchema = z.object({
    ...buoyInput
});

const updateBuoySchema = createBuoySchema;

const buoyResponseSchema = z.object({
    ...buoyInput,
    ...buoyGenerated
});

const buoysResponseSchema = z.array(buoyResponseSchema);

export type CreateBuoyInput = z.infer<typeof createBuoySchema>;
export type UpdateBuoyInput = z.infer<typeof updateBuoySchema>;

export const { schemas: buoySchemas, $ref } = buildJsonSchemas({
    createBuoySchema: createBuoySchema,
    updateBuoySchema: updateBuoySchema,
    buoyResponseSchema: buoyResponseSchema,
    buoysResponseSchema: buoysResponseSchema,
}, {
    $id: 'buoySchemas'
});
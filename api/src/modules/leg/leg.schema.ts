import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const legInput = {
    mapId: z.number(),
    startBuoyId: z.number(),
    endBuoyId: z.number(),
};

const legGenerated = {
    id: z.number(),
};

const createLegSchema = z.object({
    ...legInput
});

const updateLegSchema = createLegSchema;

const legResponseSchema = z.object({
    ...legInput,
    ...legGenerated
});

const legsResponseSchema = z.array(legResponseSchema);

export const LegIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateLegInput = z.infer<typeof createLegSchema>;
export type UpdateLegInput = z.infer<typeof updateLegSchema>;
export type LegIdParamInput = z.infer<typeof LegIdParamSchema>;

export const { schemas: legSchemas, $ref } = buildJsonSchemas({
    createLegSchema,
    updateLegSchema,
    legResponseSchema,
    legsResponseSchema,
}, {
    $id: 'legSchemas'
});
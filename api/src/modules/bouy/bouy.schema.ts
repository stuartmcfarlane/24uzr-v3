import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const bouyInput = {
    name: z.string(),
    lat: z.number(),
    lng: z.number(),
};

const bouyGenerated = {
    id: z.number(),
};

const createBouySchema = z.object({
    ...bouyInput
});

const updateBouySchema = createBouySchema;

const bouyResponseSchema = z.object({
    ...bouyInput,
    ...bouyGenerated
});

const bouysResponseSchema = z.array(bouyResponseSchema);

export type CreateBouyInput = z.infer<typeof createBouySchema>;
export type UpdateBouyInput = z.infer<typeof updateBouySchema>;

export const { schemas: bouySchemas, $ref } = buildJsonSchemas({
    createBouySchema,
    updateBouySchema,
    bouyResponseSchema,
    bouysResponseSchema,
}, {
    $id: 'bouySchemas'
});
import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const boilerplateInput = {
    name: z.string(),
    ownerId: z.number(),
};

const boilerplateGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
};

const createBoilerplateSchema = z.object({
    ...boilerplateInput
});

const updateBoilerplateSchema = createBoilerplateSchema;

const boilerplateResponseSchema = z.object({
    ...boilerplateInput,
    ...boilerplateGenerated
});

const boilerplatesResponseSchema = z.array(boilerplateResponseSchema);

export type CreateBoilerplateInput = z.infer<typeof createBoilerplateSchema>;
export type UpdateBoilerplateInput = z.infer<typeof updateBoilerplateSchema>;

export const { schemas: boilerplateSchemas, $ref } = buildJsonSchemas({
    createBoilerplateSchema,
    updateBoilerplateSchema,
    boilerplateResponseSchema,
    boilerplatesResponseSchema,
}, {
    $id: 'boilerplateSchemas'
});
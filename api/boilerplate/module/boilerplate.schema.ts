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

export const BoilerplateIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateBoilerplateInput = z.infer<typeof createBoilerplateSchema>;
export type UpdateBoilerplateInput = z.infer<typeof updateBoilerplateSchema>;
export type BoilerplateIdParamInput = z.infer<typeof BoilerplateIdParamSchema>;

export const { schemas: boilerplateSchemas, $ref } = buildJsonSchemas({
    createBoilerplateSchema,
    updateBoilerplateSchema,
    boilerplateResponseSchema,
    boilerplatesResponseSchema,
}, {
    $id: 'boilerplateSchemas'
});
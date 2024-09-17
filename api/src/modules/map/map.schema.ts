import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const mapInput = {
    name: z.string(),
};

const mapGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
};

const createMapSchema = z.object({
    ...mapInput
});

const updateMapSchema = createMapSchema;

const mapResponseSchema = z.object({
    ...mapInput,
    ...mapGenerated
});

const mapsResponseSchema = z.array(mapResponseSchema);

export type CreateMapInput = z.infer<typeof createMapSchema>;
export type UpdateMapInput = z.infer<typeof updateMapSchema>;

export const { schemas: mapSchemas, $ref } = buildJsonSchemas({
    createMapSchema,
    updateMapSchema,
    mapResponseSchema,
    mapsResponseSchema,
}, {
    $id: 'mapSchemas'
});
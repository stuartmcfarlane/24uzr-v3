import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const mapInput = {
    name: z.string(),
    isLocked: z.boolean(),
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

export const MapIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateMapInput = z.infer<typeof createMapSchema>;
export type UpdateMapInput = z.infer<typeof updateMapSchema>;
export type MapIdParamInput = z.infer<typeof MapIdParamSchema>;

export const { schemas: mapSchemas, $ref } = buildJsonSchemas({
    createMapSchema,
    updateMapSchema,
    mapResponseSchema,
    mapsResponseSchema,
}, {
    $id: 'mapSchemas'
});
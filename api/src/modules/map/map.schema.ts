import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const mapInput = {
    name: z.string(),
    isLocked: z.boolean(),
    lat1: z.number().default(0),
    lng1: z.number().default(0),
    lat2: z.number().default(0),
    lng2: z.number().default(0),
};

const mapGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
};

const createMapSchema = z.object({
    ...mapInput
});

const updateMapSchema = z.object({
    name: z.string().optional(),
    isLocked: z.boolean().optional(),
    lat1: z.number().optional(),
    lng1: z.number().optional(),
    lat2: z.number().optional(),
    lng2: z.number().optional(),
})

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
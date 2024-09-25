import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';

const routeInput = {
    name: z.string(),
    ownerId: z.number(),
    mapId: z.number(),
    startBuoyId: z.number(),
    endBuoyId: z.number(),
};

const routeGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
};

const createRouteSchema = z.object({
    ...routeInput
});

const updateRouteSchema = createRouteSchema;

const routeResponseSchema = z.object({
    ...routeInput,
    ...routeGenerated
});

const routesResponseSchema = z.array(routeResponseSchema);

export const RouteIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
export type RouteIdParamInput = z.infer<typeof RouteIdParamSchema>;

export const { schemas: routeSchemas, $ref } = buildJsonSchemas({
    createRouteSchema: createRouteSchema,
    updateRouteSchema: updateRouteSchema,
    routeResponseSchema: routeResponseSchema,
    routesResponseSchema: routesResponseSchema,
}, {
    $id: 'routeSchemas'
});
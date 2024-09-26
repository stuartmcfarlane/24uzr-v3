import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';
import { LegsOnRouteSchema, RouteCreateInputSchema } from "../../../prisma/generated/zod";

export const legsOnRoute = z.object({
  routeId: z.number().int(),
  legId: z.number().int(),
  index: z.number().int(),
})

export const legsOnRouteWithoutRoute = z.object({
  legId: z.number().int(),
  index: z.number().int(),
})

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
    ...routeInput,
    legs: z.array(legsOnRouteWithoutRoute).optional()
});

const updateRouteSchema = z.object({
    ...routeInput,
    legs: z.array(legsOnRoute).optional()
});

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
    createRouteSchema,
    updateRouteSchema,
    routeResponseSchema,
    routesResponseSchema,
}, {
    $id: 'routeSchemas'
});
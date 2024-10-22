import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';
import { BuoySchema, LegSchema, LegsOnRouteSchema, RouteTypeSchema, StatusSchema } from "../../../prisma/generated/zod";

export const legsOnRoute = z.object({
  routeId: z.number().int(),
  legId: z.number().int(),
  leg: LegSchema,
  index: z.number().int(),
})

export const legsOnRouteWithoutRoute = z.object({
  legId: z.number().int(),
  index: z.number().int(),
})

export const legsOnRouteResponseSchema = z.array(legsOnRoute)

const routeType = RouteTypeSchema

const routeStatus = StatusSchema

const routeInput = {
    name: z.string(),
    ownerId: z.number(),
    mapId: z.number(),
    planId: z.number(),
    status: routeStatus.optional(),
    type: routeType,
    startBuoyId: z.number(),
    endBuoyId: z.number(),
};

const routeGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: routeStatus,
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
    ...routeGenerated,
    startBuoy: BuoySchema,
    endBuoy: BuoySchema,
    legs: z.array(
        z.object({
            ...LegsOnRouteSchema.shape,
            leg: z.object({
                ...LegSchema.shape,
                startBuoy: BuoySchema,
                endBuoy: BuoySchema,
            })
        })
    )
});

const routesResponseSchema = z.array(routeResponseSchema);

export const RouteIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
export type RouteIdParamInput = z.infer<typeof RouteIdParamSchema>;
export type RouteStatusInput = z.infer<typeof routeStatus>;
export type RouteTypeInput = z.infer<typeof routeType>;

export const { schemas: routeSchemas, $ref } = buildJsonSchemas({
    createRouteSchema,
    updateRouteSchema,
    routeResponseSchema,
    routesResponseSchema,
    legsOnRouteResponseSchema,
}, {
    $id: 'routeSchemas'
});
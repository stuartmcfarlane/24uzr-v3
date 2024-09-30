import { z } from "zod";
import { buildJsonSchemas } from 'fastify-zod';
import { BuoySchema, LegSchema, LegsOnRouteSchema, RouteSchema } from "../../../prisma/generated/zod";

const planInput = {
    name: z.string(),
    ownerId: z.number(),
    mapId: z.number(),
    startBuoyId: z.number(),
    endBuoyId: z.number(),
};

const planGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
};

const createPlanSchema = z.object({
    ...planInput,
});

const updatePlanSchema = z.object({
    ...planInput,
});

const planResponseSchema = z.object({
    ...planInput,
    ...planGenerated,
    routes: z.array(
        z.object({
            ...RouteSchema.shape,
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
        })
    ).optional(),
});

const plansResponseSchema = z.array(planResponseSchema);

export const PlanIdParamSchema = z.object({
    id: z.coerce.number(),
}).strict()

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type PlanIdParamInput = z.infer<typeof PlanIdParamSchema>;

export const { schemas: planSchemas, $ref } = buildJsonSchemas({
    createPlanSchema,
    updatePlanSchema,
    planResponseSchema,
    plansResponseSchema,
}, {
    $id: 'planSchemas'
});
import { FastifyReply, FastifyRequest } from "fastify";
import { PlanIdParamInput, PlanIdParamSchema, CreatePlanInput, UpdatePlanInput } from './plan.schema';
import { createPlan, findPlan, findPlans, updatePlan, updatePlanRoutes } from "./plan.service";
import { getAllRoutes, Wind } from "../../services/routeApi";
import { findBuoysByMapId } from "../buoy/buoy.service";
import { findLegsByMapId } from "../leg/leg.service";
import { Ship } from "@prisma/client";
import { idIs } from "../../utils/idIs";

export async function createPlanHandler(
    request: FastifyRequest<{
        Body: CreatePlanInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const plan = await createPlan(body);

        reply.code(201).send(plan);

        const [
            buoys,
            legs,
        ] = await Promise.all([
            findBuoysByMapId(plan.mapId),
            findLegsByMapId(plan.mapId),
        ])
        const startBuoy = buoys.find(idIs(plan.startBuoyId))
        const endBuoy = buoys.find(idIs(plan.endBuoyId))
        
        const ship = {} as Ship
        const wind = {} as Wind

        const allRoutes = await getAllRoutes(plan, startBuoy!, endBuoy!, ship, legs, buoys, wind)

        await updatePlanRoutes(plan, allRoutes)
        
        return reply
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getPlansHandler() {
    const plans = await findPlans();
    
    return plans;
}

export async function getPlanHandler(
    request: FastifyRequest<{
        Params: PlanIdParamInput,
    }>,
) {
    const { id } = PlanIdParamSchema.parse(request.params)
    const plan = await findPlan(id)
    
    return plan;
}

export async function getPlanLegsHandler(
    request: FastifyRequest<{
        Params: PlanIdParamInput,
    }>,
) {
    const { id } = PlanIdParamSchema.parse(request.params)
    const legs = await findLegsByPlanId(id)
    
    return legs
}

export async function putPlanHandler(
    request: FastifyRequest<{
        Params: PlanIdParamInput,
        Body: UpdatePlanInput,
    }>,
) {
    const { id } = PlanIdParamSchema.parse(request.params)
    const route = await updatePlan(id, request.body)
    
    return route;
}


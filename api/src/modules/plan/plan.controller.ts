import { FastifyReply, FastifyRequest } from "fastify";
import { PlanIdParamInput, PlanIdParamSchema, CreatePlanInput, UpdatePlanInput } from './plan.schema';
import { createPlan, findPlan, findPlans, updatePlan, updatePlanRoutes } from "./plan.service";
import { getAllRoutes } from "../../services/routeApi";
import { findBuoysByMapId } from "../buoy/buoy.service";
import { findLegsByMapId } from "../leg/leg.service";
import { findShip } from "../ship/ship.service";
import { findWindByRegion } from "../wind/wind.service";
import { findMap } from "../map/map.service";
import { addSeconds } from "tslib";
import { idIs } from "tslib";

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
            ship,
            map,
        ] = await Promise.all([
            findBuoysByMapId(plan.mapId),
            findLegsByMapId(plan.mapId),
            findShip(plan.shipId),
            findMap(plan.mapId),
        ])
        const startBuoy = buoys.find(idIs(plan.startBuoyId))
        const endBuoy = buoys.find(idIs(plan.endBuoyId))

        const wind = await findWindByRegion(
            {
                lat1: map?.lat1.toNumber() || 0,
                lng1: map?.lng1.toNumber() || 0,
                lat2: map?.lat2.toNumber() || 0,
                lng2: map?.lng2.toNumber() || 0,
            },
            plan.startTime.toISOString(),
            addSeconds(plan.raceSecondsRemaining)(plan.startTime).toISOString()
        )

        const allRoutes = await getAllRoutes(plan, startBuoy!, endBuoy!, ship!, legs, buoys, wind)

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


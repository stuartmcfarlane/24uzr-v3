import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMapInput, MapIdParamInput, UpdateMapInput, $ref, MapIdParamSchema } from "./map.schema";
import { createMap, findMap, findMaps, updateMap } from "./map.service";
import { findBuoysByMapId } from "../buoy/buoy.service";
import { findLegsByMapId } from "../leg/leg.service";
import { findRoutesByMapId } from "../route/route.service";
import { findPlansByMapId } from "../plan/plan.service";

export async function createMapHandler(
    request: FastifyRequest<{
        Body: CreateMapInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const map = await createMap(body);
        
        return reply.code(201).send(map);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getMapsHandler() {
    const maps = await findMaps();
    
    return maps;
}

export async function getMapHandler(
    request: FastifyRequest<{
        Params: MapIdParamInput,
    }>,
) {
    const { id } = MapIdParamSchema.parse(request.params)
    const map = await findMap(id)
    
    return map;
}

export async function putMapHandler(
    request: FastifyRequest<{
        Params: MapIdParamInput,
        Body: UpdateMapInput,
    }>,
) {
    const { id } = MapIdParamSchema.parse(request.params)
    const map = await updateMap(id, request.body)
    
    return map;
}

export async function getMapBuoysHandler(
    request: FastifyRequest<{
        Params: MapIdParamInput,
    }>,
) {
    const { id } = MapIdParamSchema.parse(request.params)
    const buoys = await findBuoysByMapId(id)
    
    return buoys;
}

export async function getMapLegsHandler(
    request: FastifyRequest<{
        Params: MapIdParamInput,
    }>,
) {
    const { id } = MapIdParamSchema.parse(request.params)
    const legs = await findLegsByMapId(id)
    
    return legs;
}

export async function getMapRoutesHandler(
    request: FastifyRequest<{
        Params: MapIdParamInput,
    }>,
) {
    const { id } = MapIdParamSchema.parse(request.params)
    const routes = await findRoutesByMapId(id)
    
    return routes;
}
export async function getMapPlansHandler(
    request: FastifyRequest<{
        Params: MapIdParamInput,
    }>,
) {
    const { id } = MapIdParamSchema.parse(request.params)
    const plans = await findPlansByMapId(id)
    
    return plans;
}

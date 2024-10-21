import { FastifyReply, FastifyRequest } from "fastify";
import { RouteIdParamInput, RouteIdParamSchema, CreateRouteInput, UpdateRouteInput } from './route.schema';
import { createRoute, findRoute, findRoutes, updateRoute, updateRouteLegs, updateRouteStatus } from "./route.service";
import { getShortestRoute } from "../../services/routeApi";
import { findBuoysByMapId } from "../buoy/buoy.service";
import { findLegsByMapId, findLegsByRouteId } from "../leg/leg.service";
import { Ship } from "@prisma/client";
import { idIs } from "../../utils/idIs";

export async function createRouteHandler(
    request: FastifyRequest<{
        Body: CreateRouteInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const route = await createRoute(body);

        reply.code(201).send(route);
        if (route.status !== 'PENDING') {
            return
        }

        // const [
        //     buoys,
        //     legs,
        // ] = await Promise.all([
        //     findBuoysByMapId(route.mapId),
        //     findLegsByMapId(route.mapId),
        // ])
        // const startBuoy = buoys.find(idIs(route.startBuoyId))
        // const endBuoy = buoys.find(idIs(route.endBuoyId))
        
        // const ship = {} as Ship
        // const wind = {} as Wind

        // const legsOnRoute = await getShortestRoute(route, startBuoy!, endBuoy!, ship, legs, buoys, wind)

        // await updateRouteLegs(route.id, legsOnRoute)
        
        await updateRouteStatus(route.id, 'DONE')

        return reply
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getRoutesHandler() {
    const routes = await findRoutes();
    
    return routes;
}

export async function getRouteHandler(
    request: FastifyRequest<{
        Params: RouteIdParamInput,
    }>,
) {
    const { id } = RouteIdParamSchema.parse(request.params)
    const route = await findRoute(id)
    
    return route;
}

export async function getRouteLegsHandler(
    request: FastifyRequest<{
        Params: RouteIdParamInput,
    }>,
) {
    const { id } = RouteIdParamSchema.parse(request.params)
    const legs = await findLegsByRouteId(id)
    
    return legs
}

export async function putRouteHandler(
    request: FastifyRequest<{
        Params: RouteIdParamInput,
        Body: UpdateRouteInput,
    }>,
) {
    const { id } = RouteIdParamSchema.parse(request.params)
    const route = await updateRoute(id, request.body)
    
    return route;
}


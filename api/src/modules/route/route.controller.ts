import { FastifyReply, FastifyRequest } from "fastify";
import { RouteIdParamInput, RouteIdParamSchema, CreateRouteInput, UpdateRouteInput } from "./route.schema";
import { createRoute, findRoute, findRoutes, updateRoute, updateRouteStatus } from "./route.service";
import { delay } from "../../utils/timer";

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

        await delay(10000)
        await updateRouteStatus(route.id, 'DONE')
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
    console.log(`found route`, route)
    
    return route;
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


import { FastifyReply, FastifyRequest } from "fastify";
import { RouteIdParamInput, RouteIdParamSchema, CreateRouteInput, UpdateRouteInput } from "./route.schema";
import { createRoute, findRoute, findRoutes, updateRoute } from "./route.service";

export async function createRouteHandler(
    request: FastifyRequest<{
        Body: CreateRouteInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const route = await createRoute(body);
        
        return reply.code(201).send(route);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getRoutesHandler() {
    const boilerplates = await findRoutes();
    
    return boilerplates;
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


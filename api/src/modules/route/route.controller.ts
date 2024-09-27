import { FastifyReply, FastifyRequest } from "fastify";
import { RouteIdParamInput, RouteIdParamSchema, CreateRouteInput, UpdateRouteInput, legsOnRoute } from './route.schema';
import { createRoute, findRoute, findRoutes, updateRoute, updateRouteLegs, updateRouteStatus } from "./route.service";
import { getShortestRoute, Wind } from "../../services/routeApi";
import { findBuoy, findBuoysByMapId } from "../buoy/buoy.service";
import { findLegsByMapId } from "../leg/leg.service";
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
        console.log(`created route`, route)

        reply.code(201).send(route);
        console.log(`proceeding`)

        const [
            buoys,
            legs,
        ] = await Promise.all([
            findBuoysByMapId(route.mapId),
            findLegsByMapId(route.mapId),
        ])
        const startBuoy = buoys.find(idIs(route.startBuoyId))
        const endBuoy = buoys.find(idIs(route.endBuoyId))
        console.log(`got data`, { buoys, startBuoy, endBuoy, legs, })
        
        const ship = {} as Ship
        const wind = {} as Wind

        console.log(`fetching shortest route...`)

        const legsOnRoute = await getShortestRoute(route, startBuoy!, endBuoy!, ship, legs, buoys, wind)

        console.log(`...fetched shortest route`, legsOnRoute)

        await updateRouteLegs(route.id, legsOnRoute)
        
        console.log('done')
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


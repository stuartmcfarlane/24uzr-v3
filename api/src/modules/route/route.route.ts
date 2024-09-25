import { FastifyInstance } from "fastify";
import {
    createRouteHandler,
    getRouteHandler,
    getRoutesHandler,
    putRouteHandler,
} from "./route.controller";
import { $ref } from "./route.schema";

async function routeRoutes(server: FastifyInstance) {
    server.post(
        "/routes",
        {
            schema: {
                tags: ['route'],
                body: $ref("createRouteSchema"),
                response: {
                    201: $ref("routeResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createRouteHandler
    );
    
    server.get(
        "/route/:id",
        {
            schema: {
                tags: ['route'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("routeResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getRouteHandler
    );
    
    server.put(
        "/route/:id",
        {
            schema: {
                tags: ['route'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateRouteSchema"),
                response: {
                    200: $ref("routeResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putRouteHandler
    );
    
    server.get(
        "/routes",
        {
            schema: {
                tags: ['route'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getRoutesHandler
    );
}

export default routeRoutes;
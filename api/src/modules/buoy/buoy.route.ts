import { FastifyInstance } from "fastify";
import {
    createBuoyHandler,
    getBuoyHandler,
    getBuoysHandler,
    putBuoyHandler,
} from "./buoy.controller";
import { $ref } from "./buoy.schema";

async function buoyRoutes(server: FastifyInstance) {
    server.post(
        "/buoys",
        {
            schema: {
                tags: ['buoy'],
                body: $ref("createBuoySchema"),
                response: {
                    201: $ref("buoyResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createBuoyHandler
    );
    
    server.get(
        "/buoy/:id",
        {
            schema: {
                tags: ['buoy'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("buoyResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getBuoyHandler
    );
    
    server.put(
        "/buoy/:id",
        {
            schema: {
                tags: ['buoy'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateBuoySchema"),
                response: {
                    200: $ref("buoyResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putBuoyHandler
    );
    
    server.get(
        "/buoys",
        {
            schema: {
                tags: ['buoy'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getBuoysHandler
    );
}

export default buoyRoutes;
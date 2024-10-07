import { FastifyInstance } from "fastify";
import {
    createWindHandler,
    getWindHandler,
    getWindsHandler,
    putWindHandler,
} from "./wind.controller";
import { $ref } from "./wind.schema";

async function windRoutes(server: FastifyInstance) {
    server.post(
        "/winds",
        {
            schema: {
                tags: ['wind'],
                body: $ref("createWindSchema"),
                response: {
                    201: $ref("createWindResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createWindHandler
    );
    
    server.put(
        "/wind",
        {
            schema: {
                tags: ['wind'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateWindSchema"),
                response: {
                    200: $ref("windResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putWindHandler
    );
    
    server.get(
        "/winds",
        {
            schema: {
                tags: ['wind'],
                security: [{ bearerAuth: [], }],
                querystring: $ref("getWindsQueryStringSchema"),
                response: {
                    200: $ref("windsResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getWindHandler
    );
}

export default windRoutes;
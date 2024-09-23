import { FastifyInstance } from "fastify";
import {
    createLegHandler,
    getLegHandler,
    getLegsHandler,
    putLegHandler,
} from "./leg.controller";
import { $ref } from "./leg.schema";

async function legRoutes(server: FastifyInstance) {
    server.post(
        "/legs",
        {
            schema: {
                tags: ['leg'],
                body: $ref("createLegSchema"),
                response: {
                    201: $ref("legResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createLegHandler
    );
    
    server.get(
        "/leg/:id",
        {
            schema: {
                tags: ['leg'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("legResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getLegHandler
    );
    
    server.put(
        "/leg/:id",
        {
            schema: {
                tags: ['leg'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateLegSchema"),
                response: {
                    200: $ref("legResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putLegHandler
    );
    
    server.get(
        "/legs",
        {
            schema: {
                tags: ['leg'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getLegsHandler
    );
}

export default legRoutes;
import { FastifyInstance } from "fastify";
import {
    createBouyHandler,
    getBouyHandler,
    getBouysHandler,
    putBouyHandler,
} from "./bouy.controller";
import { $ref } from "./bouy.schema";

async function bouyRoutes(server: FastifyInstance) {
    server.post(
        "/bouys",
        {
            schema: {
                tags: ['bouy'],
                body: $ref("createBouySchema"),
                response: {
                    201: $ref("bouyResponseSchema"),
                },
            },
        },
        createBouyHandler
    );
    
    server.get(
        "/bouy/:id",
        {
            schema: {
                tags: ['bouy'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("bouyResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getBouyHandler
    );
    
    server.put(
        "/bouy/:id",
        {
            schema: {
                tags: ['bouy'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateBouySchema"),
                response: {
                    200: $ref("bouyResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putBouyHandler
    );
    
    server.get(
        "/bouys",
        {
            schema: {
                tags: ['bouy'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getBouysHandler
    );
}

export default bouyRoutes;
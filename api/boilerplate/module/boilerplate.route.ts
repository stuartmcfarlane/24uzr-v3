import { FastifyInstance } from "fastify";
import {
    createBoilerplateHandler,
    getBoilerplateHandler,
    getBoilerplatesHandler,
    putBoilerplateHandler,
} from "./boilerplate.controller";
import { $ref } from "./boilerplate.schema";

async function boilerplateRoutes(server: FastifyInstance) {
    server.post(
        "/boilerplates",
        {
            schema: {
                tags: ['boilerplate'],
                body: $ref("createBoilerplateSchema"),
                response: {
                    201: $ref("boilerplateResponseSchema"),
                },
            },
        },
        createBoilerplateHandler
    );
    
    server.get(
        "/boilerplate/:id",
        {
            schema: {
                tags: ['boilerplate'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("boilerplateResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getBoilerplateHandler
    );
    
    server.put(
        "/boilerplate/:id",
        {
            schema: {
                tags: ['boilerplate'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateBoilerplateSchema"),
                response: {
                    200: $ref("boilerplateResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putBoilerplateHandler
    );
    
    server.get(
        "/boilerplates",
        {
            schema: {
                tags: ['boilerplate'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getBoilerplatesHandler
    );
}

export default boilerplateRoutes;
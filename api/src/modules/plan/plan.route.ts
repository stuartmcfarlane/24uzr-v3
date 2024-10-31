import { FastifyInstance } from "fastify";
import {
    createPlanHandler,
    deletePlanHandler,
    getPlanHandler,
    getPlansHandler,
    putPlanHandler,
} from "./plan.controller";
import { $ref } from "./plan.schema";

async function planRoutes(server: FastifyInstance) {
    server.post(
        "/plans",
        {
            schema: {
                tags: ['plan'],
                body: $ref("createPlanSchema"),
                response: {
                    201: $ref("planResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createPlanHandler
    );
    
    server.get(
        "/plan/:id",
        {
            schema: {
                tags: ['plan'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("planResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getPlanHandler
    );
    
    server.delete(
        "/plan/:id",
        {
            schema: {
                tags: ['plan'],
                security: [ { bearerAuth: [] } ],
                response: {
                },
            },
            preHandler: [server.authenticate],
        },
        deletePlanHandler
    );
    
    server.put(
        "/plan/:id",
        {
            schema: {
                tags: ['plan'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updatePlanSchema"),
                response: {
                    200: $ref("planResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putPlanHandler
    );
    
    server.get(
        "/plans",
        {
            schema: {
                tags: ['plan'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getPlansHandler
    );
}


export default planRoutes;
import { FastifyInstance } from "fastify";
import {
    createShipHandler,
    getShipHandler,
    getShipsHandler,
    putShipHandler,
} from "./ship.controller";
import { $ref } from "./ship.schema";

async function shipRoutes(server: FastifyInstance) {
    server.post(
        "/ships",
        {
            schema: {
                tags: ['ship'],
                body: $ref("createShipSchema"),
                response: {
                    201: $ref("shipResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createShipHandler
    );
    
    server.get(
        "/ship/:id",
        {
            schema: {
                tags: ['ship'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("shipResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getShipHandler
    );
    
    server.put(
        "/ship/:id",
        {
            schema: {
                tags: ['ship'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateShipSchema"),
                response: {
                    200: $ref("shipResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putShipHandler
    );
    
    server.get(
        "/ships",
        {
            schema: {
                tags: ['ship'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getShipsHandler
    );
}

export default shipRoutes;
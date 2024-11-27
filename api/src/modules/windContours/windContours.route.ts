import { FastifyInstance } from "fastify";
import {
    createWindContoursHandler,
    getWindContoursHandler,
    getWindContoursListHandler,
    putWindContoursHandler,
} from "./windContours.controller";
import { $ref } from "./windContours.schema";

async function windContoursRoutes(server: FastifyInstance) {
    server.post(
        "/windContours",
        {
            schema: {
                tags: ['windContours'],
                body: $ref("createWindContoursSchema"),
                response: {
                    201: $ref("windContoursResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createWindContoursHandler
    );
    
    server.get(
        "/windContours/:id",
        {
            schema: {
                tags: ['windContours'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("windContoursResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getWindContoursHandler
    );
    
    server.put(
        "/windContours/:id",
        {
            schema: {
                tags: ['windContours'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateWindContoursSchema"),
                response: {
                    200: $ref("windContoursResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putWindContoursHandler
    );
    
    server.get(
        "/windContours",
        {
            schema: {
                tags: ['windContours'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getWindContoursListHandler
    );
}

export default windContoursRoutes;
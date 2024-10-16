import { FastifyInstance } from "fastify";
import {
    createGeometryHandler,
    getGeometryHandler,
    getGeometriesHandler,
    putGeometryHandler,
} from "./geometry.controller";
import { $ref } from "./geometry.schema";

async function geometryRoutes(server: FastifyInstance) {
    server.post(
        "/geometry",
        {
            schema: {
                tags: ['geometry'],
                body: $ref("createGeometrySchema"),
                response: {
                    201: $ref("geometryResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        createGeometryHandler
    );
    
    server.get(
        "/geometry/:id",
        {
            schema: {
                tags: ['geometry'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("geometryResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getGeometryHandler
    );
    
    server.put(
        "/geometry/:id",
        {
            schema: {
                tags: ['geometry'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateGeometrySchema"),
                response: {
                    200: $ref("geometryResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putGeometryHandler
    );
    
    server.get(
        "/geometry",
        {
            schema: {
                tags: ['geometry'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getGeometriesHandler
    );
}

export default geometryRoutes;
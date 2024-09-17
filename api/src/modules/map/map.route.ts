import { FastifyInstance } from "fastify";
import {
    createMapHandler,
    getMapBouysHandler,
    getMapHandler,
    getMapsHandler,
    putMapHandler,
} from "./map.controller";
import { $ref } from "./map.schema";

async function mapRoutes(server: FastifyInstance) {
    server.post(
        "/map",
        {
            schema: {
                tags: ['map'],
                body: $ref("createMapSchema"),
                response: {
                    201: $ref("mapResponseSchema"),
                },
            },
        },
        createMapHandler
    );
    
    server.get(
        "/map/:id",
        {
            schema: {
                tags: ['map'],
                security: [ { bearerAuth: [] } ],
                response: {
                    200: $ref("mapResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        getMapHandler
    );
    
    server.put(
        "/map/:id",
        {
            schema: {
                tags: ['map'],
                security: [ { bearerAuth: [] } ],
                body: $ref("updateMapSchema"),
                response: {
                    200: $ref("mapResponseSchema"),
                },
            },
            preHandler: [server.authenticate],
        },
        putMapHandler
    );
    
    server.get(
        "/maps",
        {
            schema: {
                tags: ['map'],
                security: [
                    {
                        bearerAuth: [],
                    }
                ],
            },
            preHandler: [server.authenticate],
        },
        getMapsHandler
    );

  server.get(
    "/map/:id/bouys",
    {
      schema: {
        tags: ['map'],
        security: [
          {
            bearerAuth: [],
          }
        ],
      },
      preHandler: [server.authenticate],
    },
    getMapBouysHandler
  );
}

export default mapRoutes;
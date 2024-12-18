import { FastifyInstance } from "fastify";
import {
  createMapHandler,
  getActiveMapHandler,
  getMapBuoysHandler,
  getMapGeometryHandler,
  getMapHandler,
  getMapLegsHandler,
  getMapPlansHandler,
  getMapRoutesHandler,
  getMapsHandler,
  putMapHandler,
} from "./map.controller";
import { $ref } from "./map.schema";

async function mapRoutes(server: FastifyInstance) {
  server.post(
    "/maps",
    {
      schema: {
        tags: ['map'],
        body: $ref("createMapSchema"),
        response: {
          201: $ref("mapResponseSchema"),
        },
      },
      preHandler: [server.authenticate],
    },
    createMapHandler
  );
  
  server.get(
    "/map/active",
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
    getActiveMapHandler
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
    "/map/:id/buoys",
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
    getMapBuoysHandler
  );
  
  server.get(
    "/map/:id/legs",
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
    getMapLegsHandler
  );
  
  server.get(
    "/map/:id/routes",
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
    getMapRoutesHandler
  );
  server.get(
    "/map/:id/plans",
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
    getMapPlansHandler
  );
  server.get(
    "/map/:id/geometry",
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
    getMapGeometryHandler
  );
}

export default mapRoutes;
import { FastifyInstance } from "fastify";
import {
  loginHandler,
  registerUserHandler,
  getUsersHandler,
  getUserHandler,
  putUserHandler,
  getUserShipsHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/register",
    {
      schema: {
        tags: ['user'],
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );
  
  server.post(
    "/login",
    {
      schema: {
        tags: ['user'],
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );
  
  server.get(
    "/user",
    {
      schema: {
        tags: ['user'],
        security: [ { bearerAuth: [] } ],
        response: {
          200: $ref("getUserResponseSchema"),
        },
      },
      preHandler: [server.authenticate],
    },
    getUserHandler
  );

  server.put(
    "/user",
    {
      schema: {
        tags: ['user'],
        security: [ { bearerAuth: [] } ],
        body: $ref("updateUserSchema"),
        response: {
          200: $ref("updateUserResponseSchema"),
        },
      },
      preHandler: [server.authenticate],
    },
    putUserHandler
  );

  server.get(
    "/users",
    {
      schema: {
        tags: ['user'],
        security: [
          {
            bearerAuth: [],
          }
        ],
      },
      preHandler: [server.authenticate],
    },
    getUsersHandler
  );

  server.get(
    "/user/ships",
    {
      schema: {
        tags: ['user'],
        security: [
          {
            bearerAuth: [],
          }
        ],
      },
      preHandler: [server.authenticate],
    },
    getUserShipsHandler
  );
}

export default userRoutes;
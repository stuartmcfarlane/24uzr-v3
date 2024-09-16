import { FastifyInstance } from "fastify";
import {
  loginHandler,
  registerUserHandler,
  getUsersHandler,
  getUserHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/users",
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
}

export default userRoutes;
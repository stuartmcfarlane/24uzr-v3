import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyJWT, { JWT } from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";
import userRoutes from "./modules/user/user.route";
// import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
// import { productSchemas } from "./modules/product/product.schema";
import { version } from "../package.json";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

function buildServer() {
  const server = Fastify();
  
  if (process.env.JWT_SECRET === undefined) throw new Error(`JWT_SECRET missing in the environment`)
    
  server.register(fastifyJWT, {
    secret: process.env.JWT_SECRET,
  });
  
  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        return reply.send(e);
      }
    }
  );
  
  server.get("/healthcheck", async function () {
    return { status: "OK" };
  });
  
  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });
  
  for (const schema of [ ...userSchemas, ]) {
    server.addSchema(schema);
  }
  
  const swaggerOptions = {
    swagger: {
      info: {
        title: "My Title",
        description: "My Description.",
        version: "1.0.0",
      },
      host: "localhost",
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [{ name: "Default", description: "Default" }],
    },
  };
  
  const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
  };
  
  server.register(fastifySwagger, swaggerOptions);
  server.register(fastifySwaggerUi, swaggerUiOptions);
  
  server.register(userRoutes, { prefix: "api/users" });
  console.log(`registered /api/users`)
  
  return server;
}

export default buildServer;
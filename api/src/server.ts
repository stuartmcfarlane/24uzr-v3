import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyJWT, { JWT } from "@fastify/jwt";
import fastifySwagger, { FastifyDynamicSwaggerOptions, FastifySwaggerOptions } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import { version } from '../package.json'

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
  const server = Fastify({
    logger: true
  });
  
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
  
  const swaggerOptions: FastifyDynamicSwaggerOptions = {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: "24uzr API",
        description: "Optimise you 24 hour sailing race desicions.",
        version,
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      tags: [
        { name: 'user', description: 'User related end-points' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        }
      },
    },
  };

  const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
  };
  
  server.register(fastifySwagger, swaggerOptions);
  server.register(fastifySwaggerUi, swaggerUiOptions);
  
  server.register(userRoutes, { prefix: "/api" });
  
  return server;
}

export default buildServer;
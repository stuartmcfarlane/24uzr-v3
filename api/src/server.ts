import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fastifyJWT, { JWT } from "@fastify/jwt";
import fastifyCookie from '@fastify/cookie'
import fastifySwagger, { FastifyDynamicSwaggerOptions, FastifySwaggerOptions } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors"
import userRoutes from "./modules/user/user.route";
import shipRoutes from "./modules/ship/ship.route";
import buoyRoutes from "./modules/buoy/buoy.route";
import mapRoutes from "./modules/map/map.route";
import legRoutes from "./modules/leg/leg.route";
import routeRoutes from "./modules/route/route.route";
import planRoutes from "./modules/plan/plan.route";
import { userSchemas } from "./modules/user/user.schema";
import { shipSchemas } from "./modules/ship/ship.schema";
import { buoySchemas } from "./modules/buoy/buoy.schema";
import { mapSchemas } from "./modules/map/map.schema";
import { legSchemas } from "./modules/leg/leg.schema";
import { routeSchemas } from "./modules/route/route.schema";
import { planSchemas } from "./modules/plan/plan.schema";
import { version } from '../package.json'

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any
  }
}

type UserPayload = {
  id: number
  email: string
  name: string
  isAdmin: boolean
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload
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
        const token = request.cookies.access_token
        if (!token) {
          const result = await request.jwtVerify();
          return result
        }
        const decoded = request.jwt.verify<UserPayload>(token)
        request.user = decoded
        return decoded
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
  
  server.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    hook: 'preHandler',
  })
  
  server.register(cors, {
    origin: 'http://localhost',
    credentials: true,
  })
  
  for (const schema of [
    ...userSchemas,
    ...shipSchemas,
    ...buoySchemas,
    ...mapSchemas,
    ...legSchemas,
    ...routeSchemas,
    ...planSchemas,
  ]) {
    server.addSchema(schema);
  }
  
  const swaggerOptions: FastifyDynamicSwaggerOptions = {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: "24uzr API",
        description: "Optimize you 24 hour sailing race decisions.",
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
        { name: 'ship', description: 'Ship related end-points' },
        { name: 'buoy', description: 'Buoy related end-points' },
        { name: 'map', description: 'Map related end-points' },
        { name: 'route', description: 'Route related end-points' },
        { name: 'plan', description: 'Plan related end-points' },
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
  server.register(shipRoutes, { prefix: "/api" });
  server.register(buoyRoutes, { prefix: "/api" });
  server.register(mapRoutes, { prefix: "/api" });
  server.register(legRoutes, { prefix: "/api" });
  server.register(routeRoutes, { prefix: "/api" });
  server.register(planRoutes, { prefix: "/api" });
  
  return server;
}

export default buildServer;
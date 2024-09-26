import { RouteUpdateInputSchema } from "../../../prisma/generated/zod";
import prisma from "../../utils/prisma";
import { CreateRouteInput, UpdateRouteInput } from "./route.schema";

export async function createRoute(data: CreateRouteInput) {
    console.log(`createRoute`, data)
    const legs = (
        data.legs
            ? {
                legs: {
                    create: data.legs,
                }
            } :
            {
                legs: undefined
            }
    )
    const route = await prisma.route.create({
        data: {
            ...data,
            ...legs,
        },
        include: {
            legs: true
        },
    });
    
    return route;
}

export async function findRoute(id: number) {
    return prisma.route.findUnique({
        include: {
            legs: true
        },
        where: {
            id,
        },
    });
}

export async function updateRoute(id: number, route: UpdateRouteInput) {
    const legs = (
        route.legs
            ? {
                legs: {
                    update: {
                        where: {
                            // pffffffff
                            routeId: id,
                        },
                        data: route.legs,
                    }
                }
            } :
            {
                legs: undefined
            }
    )
    return prisma.route.update({
        where: {
            id,
        },
        data: {
            ...route,
            ...{
                legs: undefined
            },
        }
    });
}

export async function findRoutes() {
    return prisma.route.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                }
            },
            legs: true
        }
    });
}

export async function findRoutesByMapId(mapId: number) {
    return prisma.route.findMany({
        where: {
            mapId
        },
    });
}
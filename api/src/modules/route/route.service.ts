import { RouteUpdateInputSchema } from "../../../prisma/generated/zod";
import prisma from "../../utils/prisma";
import { CreateRouteInput, RouteStatusInput, UpdateRouteInput, legsOnRoute } from './route.schema';
import { StatusSchema, LegsOnRoute } from '../../../prisma/generated/zod/index';

export async function createRoute(route: CreateRouteInput) {
    console.log(`createRoute`, route)
    const { type } = route
    const legs = (
        route.legs
            ? {
                legs: {
                    create: route.legs,
                }
            } :
            {
                legs: undefined
            }
    )
    const status: RouteStatusInput = route.status || type === 'USER' ? 'DONE' : 'PENDING'
    const data = {
        ...route,
        status,
        ...legs,
    }
    const created = await prisma.route.create({
        data,
        include: {
            legs: true
        },
    });
    
    return created;
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
export async function updateRouteStatus(id: number, status: RouteStatusInput) {
    return prisma.route.update({
        where: {
            id,
        },
        data: {
            status,
        }
    });
}
export async function updateRouteLegs(routeId: number, legsOnRoute: LegsOnRoute[]) {
    return Promise.all(
        legsOnRoute.map(
            (leg: LegsOnRoute) => prisma.legsOnRoute.create({
                data: {
                    ...leg,
                    routeId,
                }
            })
        )
    )
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
        include: {
            legs: {
                include: {
                    leg: true
                }
            }
        },
        where: {
            mapId
        },
    });
}

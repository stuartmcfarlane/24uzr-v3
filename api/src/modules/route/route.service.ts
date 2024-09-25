import prisma from "../../utils/prisma";
import { CreateRouteInput, UpdateRouteInput } from "./route.schema";

export async function createRoute(data: CreateRouteInput) {
    const route = await prisma.route.create({
        data
    });
    
    return route;
}

export async function findRoute(id: number) {
    return prisma.route.findUnique({
        where: {
            id,
        },
    });
}

export async function updateRoute(id: number, route: UpdateRouteInput ) {
    return prisma.route.update({
        where: {
            id,
        },
        data: route
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
            }
        }
    });
}


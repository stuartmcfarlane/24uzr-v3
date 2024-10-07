import { Plan } from "@prisma/client";
import prisma from "../../utils/prisma";
import { CreateRouteInput } from "../route/route.schema";
import { CreatePlanInput, UpdatePlanInput } from './plan.schema';
import { createRoute } from "../route/route.service";

export async function createPlan(plan: CreatePlanInput) {
    const data = {
        ...plan,
    }
    const created = await prisma.plan.create({
        data,
    });
    
    return created;
}

export async function findPlan(id: number) {
    return prisma.plan.findUnique({
        include: {
            routes: {
                include: {
                    legs: {
                        include: {
                            leg: {
                                include: {
                                    startBuoy: true,
                                    endBuoy: true,
                                }
                            }
                        }
                    }
                }
            }
        },
        where: {
            id,
        },
    });
}

export async function updatePlan(id: number, plan: UpdatePlanInput) {
    return prisma.plan.update({
        where: {
            id,
        },
        data: {
            ...plan,
        }
    });
}
export async function findPlans() {
    return prisma.plan.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                }
            },
            routes: true
        }
    });
}

export async function findPlansByMapId(mapId: number) {
    return prisma.plan.findMany({
        include: {
            routes: true
        },
        where: {
            mapId
        },
    });
}

export async function updatePlanRoutes(plan: Plan, routes: CreateRouteInput[]) {
    return Promise.all(
        routes.map(
            route => createRoute({
                ...route,
                ownerId: plan.ownerId,
                status: 'DONE',
                planId: plan.id,
                legs: route.legs,
            })
        )
    )
}
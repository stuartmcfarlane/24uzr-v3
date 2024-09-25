import prisma from "../../utils/prisma";
import { CreateLegInput, UpdateLegInput } from "./leg.schema";

export async function createLeg(data: CreateLegInput) {
    const leg = await prisma.leg.create({
        data
    });
    
    return leg;
}

export async function findLeg(id: number) {
    return prisma.leg.findUnique({
        include: {
            startBuoy: true,
            endBuoy: true,
        },
        where: {
            id,
        },
    });
}

export async function updateLeg(id: number, leg: UpdateLegInput ) {
    return prisma.leg.update({
        where: {
            id,
        },
        data: leg
    });
}

export async function findLegs() {
    return prisma.leg.findMany({
        include: {
            startBuoy: true,
            endBuoy: true,
        },
    });
}

export async function findLegsByMapId(mapId: number) {
    return prisma.leg.findMany({
        where: {
            mapId
        },
    });
}

export async function findLegsByRouteId(routeId: number) {
    return prisma.legsOnRoute.findMany({
        where: {
            routeId
        },
    });
}
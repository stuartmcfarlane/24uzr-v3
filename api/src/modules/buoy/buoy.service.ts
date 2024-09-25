import prisma from "../../utils/prisma";
import { CreateBuoyInput, UpdateBuoyInput } from "./buoy.schema";

export async function createBuoy(data: CreateBuoyInput) {
    const buoy = await prisma.buoy.create({
        data
    });
    
    return buoy;
}

export async function findBuoy(id: number) {
    console.log(`find buoy ${id}`)
    return prisma.buoy.findUnique({
        relationLoadStrategy: 'join',
        include: {
            legsOut: {
                include: {
                    endBuoy: true
                }
            },
            legsIn: {
                include: {
                    startBuoy: true
                }
            },
        },
        where: {
            id,
        },
    });
}

export async function updateBuoy(id: number, buoy: UpdateBuoyInput ) {
    return prisma.buoy.update({
        where: {
            id,
        },
        data: buoy
    });
}

export async function findBuoys() {
    return prisma.buoy.findMany({
    });
}

export async function findBuoysByMapId(mapId: number) {
    return prisma.buoy.findMany({
        where: {
            mapId
        },
    });
}

export async function deleteBuoy(id: number) {
    return prisma.buoy.delete({
        where: {
            id,
        },
    });
}


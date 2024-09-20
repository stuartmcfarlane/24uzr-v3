import prisma from "../../utils/prisma";
import { CreateBuoyInput, UpdateBuoyInput } from "./buoy.schema";

export async function createBuoy(data: CreateBuoyInput) {
    const buoy = await prisma.buoy.create({
        data
    });
    
    return buoy;
}

export async function findBuoy(id: number) {
    return prisma.buoy.findUnique({
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
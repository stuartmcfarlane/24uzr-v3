import prisma from "../../utils/prisma";
import { CreateMapInput, UpdateMapInput } from "./map.schema";

export async function createMap(data: CreateMapInput) {
    const map = await prisma.map.create({
        data
    });
    
    return map;
}

export async function findMap(id: number) {
    return prisma.map.findUnique({
        where: {
            id,
        },
    });
}

export async function updateMap(id: number, map: UpdateMapInput ) {
    return prisma.map.update({
        where: {
            id,
        },
        data: map
    });
}

export async function findMaps() {
    return prisma.map.findMany({
    });
}

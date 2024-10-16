import prisma from "../../utils/prisma";
import { CreateGeometryInput, UpdateGeometryInput } from "./geometry.schema";

export async function createGeometry(data: CreateGeometryInput) {
    const geometry = await prisma.geometry.create({
        data
    });
    
    return geometry;
}

export async function findGeometry(id: number) {
    return prisma.geometry.findUnique({
        where: {
            id,
        },
    });
}

export async function updateGeometry(id: number, geometry: UpdateGeometryInput ) {
    return prisma.geometry.update({
        where: {
            id,
        },
        data: geometry
    });
}

export async function findGeometries() {
    return prisma.geometry.findMany();
}

export async function findGeometryByMapId(mapId: number) {
    return prisma.geometry.findMany({
        where: {
            mapId
        },
    });
}
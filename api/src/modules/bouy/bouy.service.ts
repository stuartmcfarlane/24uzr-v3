import prisma from "../../utils/prisma";
import { CreateBouyInput, UpdateBouyInput } from "./bouy.schema";

export async function createBouy(data: CreateBouyInput) {
    const bouy = await prisma.bouy.create({
        data
    });
    
    return bouy;
}

export async function findBouy(id: number) {
    return prisma.bouy.findUnique({
        where: {
            id,
        },
    });
}

export async function updateBouy(id: number, bouy: UpdateBouyInput ) {
    return prisma.bouy.update({
        where: {
            id,
        },
        data: bouy
    });
}

export async function findBouys() {
    return prisma.bouy.findMany({
    });
}

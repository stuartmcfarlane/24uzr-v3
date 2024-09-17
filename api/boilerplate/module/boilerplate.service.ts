import prisma from "../../src/utils/prisma";
import { CreateBoilerplateInput, UpdateBoilerplateInput } from "./boilerplate.schema";

export async function createBoilerplate(data: CreateBoilerplateInput) {
    const boilerplate = await prisma.boilerplate.create({
        data
    });
    
    return boilerplate;
}

export async function findBoilerplate(id: number) {
    return prisma.boilerplate.findUnique({
        where: {
            id,
        },
    });
}

export async function updateBoilerplate(id: number, boilerplate: UpdateBoilerplateInput ) {
    return prisma.boilerplate.update({
        where: {
            id,
        },
        data: boilerplate
    });
}

export async function findBoilerplates() {
    return prisma.boilerplate.findMany({
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

export async function findBoilerplatesByOwnerId(ownerId: number) {
    return prisma.boilerplate.findMany({
        where: {
            ownerId
        },
    });
}
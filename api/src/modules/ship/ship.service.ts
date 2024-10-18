import prisma from "../../utils/prisma";
import { CreateShipInput, UpdateShipInput } from "./ship.schema";

export async function createShip(data: CreateShipInput) {
    const ship = await prisma.ship.create({
        data
    });
    
    return ship;
}

export async function findShip(id: number) {
    return prisma.ship.findUnique({
        include: {
            shipPolar: true,
        },
        where: {
            id,
        },
    });
}

export async function updateShip(id: number, ship: UpdateShipInput ) {
    return prisma.ship.update({
        where: {
            id,
        },
        data: ship
    });
}

export async function findShips() {
    return prisma.ship.findMany({
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

export async function findShipsByOwnerId(ownerId: number) {
    return prisma.ship.findMany({
        where: {
            ownerId
        },
    });
}
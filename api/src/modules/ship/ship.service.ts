import prisma from "../../utils/prisma";
import { shipPolarOrc2csv } from "../../utils/shipPolar";
import { CreateShipInput, UpdateShipInput } from "./ship.schema";

export async function createShip(data: CreateShipInput) {
    const ship = await prisma.ship.create({
        data
    });
    
    return ship;
}

export async function findShip(id: number) {
    const ship = await prisma.ship.findUnique({
        where: {
            id,
        },
    });
    console.log(`findShip`, ship)
    if (!ship) return null
    if (ship?.polar) return ship
    
    const polar = await fetchPolar(ship)
    if (!polar) return ship
    const updated = await updateShip(ship?.id, {
        polar
    })
    return updated
}

const fetchPolar = async (
    {
        id,
        sailNumber,
        lastFetchOfPolarData,
    }: {
        id: number,
        sailNumber: string,
        lastFetchOfPolarData: Date,
    }
): Promise<string> => {
    const oneDayAgo = Date.now() - 24 * 60 * 60
    if (oneDayAgo < lastFetchOfPolarData.getTime()) return ''
    console.log(`fetchPolar`, lastFetchOfPolarData.getTime(), oneDayAgo)
    try {
        const response = await fetch(`https://jieter.github.io/orc-data/site/data/${sailNumber}.json`, {
            method: 'get',
        })
        if (!response.ok) return ''
        const json = await response.json()
        console.log(`got JSON`, json)
        const polar = shipPolarOrc2csv(json.vpp)
        console.log(`got CSV`, polar)
        return polar
    }
    catch (err) {
        console.error(err)
    }
    return ''
    
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
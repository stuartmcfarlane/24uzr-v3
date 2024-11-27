import prisma from "../../utils/prisma"
import { CreateSingleWindContoursInput, CreateWindContoursInput, UpdateWindContoursInput } from "./windContours.schema"
import { Region, Timestamp, timestamp2string } from 'tslib'

export async function createSingleWindContours(data: CreateSingleWindContoursInput) {
    const windContours = await prisma.windContours.create({
        data
    })
    
    return windContours
}

export async function createWindContours(data: CreateWindContoursInput) {
    const wind = await (
        Array.isArray(data)
            ? Promise.all(data.map(createSingleWindContours))
            : createSingleWindContours(data as CreateSingleWindContoursInput)
    )
    
    return wind
}

export async function findWindContours(id: number) {
    return prisma.windContours.findUnique({
        where: {
            id,
        },
    })
}

export async function findWindContoursByRegion(region: Region) {
    const {
        lat1,
        lng1,
        lat2,
        lng2,
    } = region
    return prisma.windContours.findFirst({
        where: {
            OR: [
                {
                    AND: [
                        { lat1: { lte: lat2 } },
                        { lat1: { gte: lat1 } },
                        { lng1: { lte: lng2 } },
                        { lng1: { gte: lng1 } },
                    ],
                },
                {
                    AND: [
                        { lat2: { lte: lat2 } },
                        { lat2: { gte: lat1 } },
                        { lng2: { lte: lng2 } },
                        { lng2: { gte: lng1 } },
                    ],
                },
            ]
        },
    })
}

export async function updateWindContours(id: number, windContours: UpdateWindContoursInput ) {
    return prisma.windContours.update({
        where: {
            id,
        },
        data: windContours
    })
}

export async function findWindContoursList() {
    return prisma.windContours.findMany()
}

export async function deleteWindContoursByTimestamp(timestamp: Timestamp) {
    return prisma.wind.deleteMany({
        where: {
            timestamp: timestamp2string(timestamp),
        },
    })
}
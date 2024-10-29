import prisma from "../../utils/prisma"
import { Region } from "tslib"
import { CreateBulkWindInput, CreateSingleWindInput, CreateWindInput, UpdateWindInput } from './wind.schema'

const bulkData2dbData = (data: CreateBulkWindInput): CreateSingleWindInput[] => (Array.isArray(data) ? data : [data]).reduce(
    (dbData, { data, timestamp }) => [
        ...dbData,
        ...data.map(
            (data) => ({
                ...data,
                timestamp,
            })
        )
    ],
    [] as CreateSingleWindInput[]
)

export async function createSingleWind(data: CreateSingleWindInput) {
    return prisma.wind.upsert({
        where: {
            timestamp_lat_lng: {
                timestamp: (data as CreateSingleWindInput).timestamp,
                lat: (data as CreateSingleWindInput).lat,
                lng: data.lng,
            }
        },
        create: {
            timestamp: data.timestamp,
            lat: data.lat,
            lng: data.lng,
            u: data.u,
            v: data.v,
        },
        update: {
            u: data.u,
            v: data.v,
        }
    })
}
export async function createWind(data: CreateWindInput) {
    const wind = await (
        Array.isArray(data)
            ? createMuchWind(data)
            : createSingleWind(data as CreateSingleWindInput)
    )
    
    return wind
}

const chunk = <T>(size: number, a: T[]) => {
    var R = []
    for (var i = 0; i < a.length; i += size)
        R.push(a.slice(i, i + size))
    return R
}

async function createMuchWind(bulkData: CreateBulkWindInput) {
    try {
        const data = bulkData2dbData(bulkData)
        const timestamps = (Array.isArray(bulkData) ? bulkData : [bulkData]).map(({timestamp}: {timestamp: string}) => timestamp)

        await prisma.wind.deleteMany({
            where: {
                timestamp: {
                    in: timestamps
                }
            }
        })

        const chunks = chunk(100, data)

        await Promise.all(
            chunks.map(
                data => prisma.wind.createMany({ data })
            )
        )
    }
    catch (err) {
        console.error(err)
    }
    return []
}

export async function findWind(timestamp: string, lat: number, lng: number) {
    return prisma.wind.findUnique({
        where: {
            timestamp_lat_lng: {
                timestamp,
                lat,
                lng,
            },
        },
    })
}

export async function findWindByRegion(region: Region, from: string, until?: string) {
    const query = {
        where: {
            lat: {
                gte: region.lat1,
                lte: region.lat2,
            },
            lng: {
                gte: region.lng1,
                lte: region.lng2,
            },
            ...(
                until
                    ? {
                        timestamp: {
                            gte: from,
                            lte: until,
                        }
                    }
                    : { timestamp: from }
            ),
        },
    }
    return prisma.wind.findMany(query)
}

export async function updateWind(wind: UpdateWindInput ) {
    return prisma.wind.update({
        where: {
            timestamp_lat_lng: {
                timestamp: wind.timestamp,
                lat: wind.lat,
                lng: wind.lng,
            },
        },
        data: wind
    })
}

export async function deleteOldWind() {
    const ONE_DAY = 24 * 60 * 60 * 1000
    const oldTimestamp = (new Date(Date.now() - ONE_DAY)).toISOString()
    return prisma.wind.deleteMany({
        where: {
            timestamp: {
                lt: oldTimestamp
            },
        },
    })
}
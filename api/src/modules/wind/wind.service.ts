import prisma from "../../utils/prisma";
import { CreateBulkWindInput, CreateSingleWindInput, CreateWindInput, RegionSchema, UpdateWindInput } from './wind.schema';

const bulkData2dbData = (data: CreateBulkWindInput) => data.reduce(
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

export async function createWind(data: CreateWindInput) {
    const wind = await (
        Array.isArray(data)
            ? createMuchWind(data)
            : prisma.wind.upsert({
                where: {
                    timestamp_lat_lng: {
                        timestamp: data.timestamp,
                        lat: data.lat,
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
    )
    
    return wind;
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
        const timestamps = bulkData.map(({timestamp}) => timestamp)

        await prisma.wind.deleteMany({
            where: {
                timestamp: {
                    in: timestamps
                }
            }
        })

        const chunks = chunk(10, data)

        await Promise.all(
            chunks.map(
                data => prisma.wind.createMany({ data })
            )
        )
    }
    catch (err) {
        console.log(err)
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
    });
}

export async function findWindByRegion(region: RegionSchema, timestamp?: string) {
    return prisma.wind.findMany({
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
                timestamp
                ? { timestamp }
                : {}
            ),
        },
    });
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
    });
}


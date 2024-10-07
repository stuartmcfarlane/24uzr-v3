import { FastifyReply, FastifyRequest } from "fastify";
import { CreateWindInput, getWindsQueryStringSchema, UpdateWindInput } from "./wind.schema";
import { createWind, findWind, findWindByRegion, updateWind } from "./wind.service";

export async function createWindHandler(
    request: FastifyRequest<{
        Body: CreateWindInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const wind = await createWind(body);
        
        return reply.code(201).send(wind);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getWindHandler(
    request: FastifyRequest<{
        Querystring: {
            timestamp?: string,
            from?: string,
            until?: string,
            lat?: string,
            lng?: string,
            lat1?: string,
            lng1?: string,
            lat2?: string,
            lng2?: string,
        },
    }>,
) {
    const { timestamp, from, until, lat, lng, lat1, lng1, lat2, lng2 } = getWindsQueryStringSchema.parse(request.query)
    
    console.log(`>getWindHandler`, { timestamp, from, until, lat, lng, lat1, lng1, lat2, lng2 })
    const wind = await (
        (lat && lng && timestamp)
            ? findWind(timestamp, lat, lng)
            : (from && until && lat1 && lng1 && lat2 && lng2)
                ? findWindByRegion({ lat1, lng1, lat2, lng2 }, from, until)
                : (timestamp && lat1 && lng1 && lat2 && lng2)
                    ? findWindByRegion({ lat1, lng1, lat2, lng2 }, timestamp)
                    : []
    )
    
    return wind;
}

export async function putWindHandler(
    request: FastifyRequest<{
        Body: UpdateWindInput,
    }>,
) {
    const wind = await updateWind(request.body)
    
    return wind;
}
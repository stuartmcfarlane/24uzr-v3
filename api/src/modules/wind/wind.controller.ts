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
        Params: {
            timestamp?: string,
            lat?: string,
            lng?: string,
            lat1?: string,
            lng1?: string,
            lat2?: string,
            lng2?: string,
        },
    }>,
) {
    const { timestamp, lat, lng, lat1, lng1, lat2, lng2 } = getWindsQueryStringSchema.parse(request.params)
    
    const wind = await (
        (lat && lng && timestamp)
        ? findWind(timestamp, lat, lng)
            : (lat1 && lng1 && lat2 && lng2)
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
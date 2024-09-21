import { FastifyReply, FastifyRequest } from "fastify";
import { BuoyIdParamInput, BuoyIdParamSchema, CreateBuoyInput, UpdateBuoyInput } from "./buoy.schema";
import { createBuoy, findBuoy, findBuoys, updateBuoy } from "./buoy.service";

export async function createBuoyHandler(
    request: FastifyRequest<{
        Body: CreateBuoyInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const buoy = await createBuoy(body);
        
        return reply.code(201).send(buoy);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getBuoysHandler() {
    const buoy = await findBuoys();
    
    return buoy;
}

export async function getBuoyHandler(
    request: FastifyRequest<{
        Params: BuoyIdParamInput,
    }>,
) {
    const { id } = BuoyIdParamSchema.parse(request.params)
    const buoy = await findBuoy(id)
    
    return buoy;
}

export async function putBuoyHandler(
    request: FastifyRequest<{
        Body: UpdateBuoyInput,
        Params: BuoyIdParamInput,
    }>,
) {
    const { id } = BuoyIdParamSchema.parse(request.params)
    const buoy = await updateBuoy(id, request.body)
    
    return buoy;
}
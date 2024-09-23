import { FastifyReply, FastifyRequest } from "fastify";
import { LegIdParamInput, LegIdParamSchema, CreateLegInput, UpdateLegInput } from "./leg.schema";
import { createLeg, findLeg, findLegs, updateLeg } from "./leg.service";

export async function createLegHandler(
    request: FastifyRequest<{
        Body: CreateLegInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const leg = await createLeg(body);
        
        return reply.code(201).send(leg);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getLegsHandler() {
    const legs = await findLegs();
    
    return legs;
}

export async function getLegHandler(
    request: FastifyRequest<{
        Params: LegIdParamInput,
    }>,
) {
    const { id } = LegIdParamSchema.parse(request.params)
    const leg = await findLeg(id)
    
    return leg;
}

export async function putLegHandler(
    request: FastifyRequest<{
        Params: LegIdParamInput,
        Body: UpdateLegInput,
    }>,
) {
    const { id } = LegIdParamSchema.parse(request.params)
    const leg = await updateLeg(id, request.body)
    
    return leg;
}
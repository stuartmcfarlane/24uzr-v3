import { FastifyReply, FastifyRequest } from "fastify";
import { CreateBouyInput, UpdateBouyInput } from "./bouy.schema";
import { createBouy, findBouy, findBouys, updateBouy } from "./bouy.service";

export async function createBouyHandler(
    request: FastifyRequest<{
        Body: CreateBouyInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const bouy = await createBouy(body);
        
        return reply.code(201).send(bouy);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getBouysHandler() {
    const bouys = await findBouys();
    
    return bouys;
}

export async function getBouyHandler(
    request: FastifyRequest<{
        Params: { id: number },
    }>,
) {
    const { id } = request.params
    const bouy = await findBouy(id)
    
    return bouy;
}

export async function putBouyHandler(
    request: FastifyRequest<{
        Params: { id: number },
        Body: UpdateBouyInput,
    }>,
) {
    const { id } = request.params
    const bouy = await updateBouy(id, request.body)
    
    return bouy;
}
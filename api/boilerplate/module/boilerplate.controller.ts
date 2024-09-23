import { FastifyReply, FastifyRequest } from "fastify";
import { BoilerplateIdParamInput, BoilerplateIdParamSchema, CreateBoilerplateInput, UpdateBoilerplateInput } from "./boilerplate.schema";
import { createBoilerplate, findBoilerplate, findBoilerplates, updateBoilerplate } from "./boilerplate.service";

export async function createBoilerplateHandler(
    request: FastifyRequest<{
        Body: CreateBoilerplateInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const boilerplate = await createBoilerplate(body);
        
        return reply.code(201).send(boilerplate);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getBoilerplatesHandler() {
    const boilerplates = await findBoilerplates();
    
    return boilerplates;
}

export async function getBoilerplateHandler(
    request: FastifyRequest<{
        Params: BoilerplateIdParamInput,
    }>,
) {
    const { id } = BoilerplateIdParamSchema.parse(request.params)
    const boilerplate = await findBoilerplate(id)
    
    return boilerplate;
}

export async function putBoilerplateHandler(
    request: FastifyRequest<{
        Params: BoilerplateIdParamInput,
        Body: UpdateBoilerplateInput,
    }>,
) {
    const { id } = BoilerplateIdParamSchema.parse(request.params)
    const boilerplate = await updateBoilerplate(id, request.body)
    
    return boilerplate;
}
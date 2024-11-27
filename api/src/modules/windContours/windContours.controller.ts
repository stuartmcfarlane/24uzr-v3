import { FastifyReply, FastifyRequest } from "fastify";
import { WindContoursIdParamInput, WindContoursIdParamSchema, CreateWindContoursInput, UpdateWindContoursInput } from "./windContours.schema";
import { createWindContours, findWindContours, findWindContoursList, updateWindContours } from "./windContours.service";

export async function createWindContoursHandler(
    request: FastifyRequest<{
        Body: CreateWindContoursInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        await createWindContours(body);
        
        return reply.code(201).send();
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getWindContoursListHandler() {
    const boilerplates = await findWindContoursList();
    
    return boilerplates;
}

export async function getWindContoursHandler(
    request: FastifyRequest<{
        Params: WindContoursIdParamInput,
    }>,
) {
    const { id } = WindContoursIdParamSchema.parse(request.params)
    const windContours = await findWindContours(id)
    
    return windContours;
}

export async function putWindContoursHandler(
    request: FastifyRequest<{
        Params: WindContoursIdParamInput,
        Body: UpdateWindContoursInput,
    }>,
) {
    const { id } = WindContoursIdParamSchema.parse(request.params)
    const windContours = await updateWindContours(id, request.body)
    
    return windContours;
}
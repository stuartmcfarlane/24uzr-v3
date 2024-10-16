import { FastifyReply, FastifyRequest } from "fastify";
import { GeometryIdParamInput, GeometryIdParamSchema, CreateGeometryInput, UpdateGeometryInput } from "./geometry.schema";
import { createGeometry, findGeometry, findGeometries, updateGeometry } from "./geometry.service";

export async function createGeometryHandler(
    request: FastifyRequest<{
        Body: CreateGeometryInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const geometry = await createGeometry(body);
        
        return reply.code(201).send(geometry);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getGeometriesHandler() {
    const geometries = await findGeometries();
    
    return geometries;
}

export async function getGeometryHandler(
    request: FastifyRequest<{
        Params: GeometryIdParamInput,
    }>,
) {
    const { id } = GeometryIdParamSchema.parse(request.params)
    const geometry = await findGeometry(id)
    
    return geometry;
}

export async function putGeometryHandler(
    request: FastifyRequest<{
        Params: GeometryIdParamInput,
        Body: UpdateGeometryInput,
    }>,
) {
    const { id } = GeometryIdParamSchema.parse(request.params)
    const geometry = await updateGeometry(id, request.body)
    
    return geometry;
}
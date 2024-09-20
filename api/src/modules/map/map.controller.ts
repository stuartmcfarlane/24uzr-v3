import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMapInput, MapIdParamInput, UpdateMapInput, $ref, MapIdParamSchema } from "./map.schema";
import { createMap, findMap, findMaps, updateMap } from "./map.service";
import { findBuoysByMapId } from "../buoy/buoy.service";

export async function createMapHandler(
    request: FastifyRequest<{
        Body: CreateMapInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const map = await createMap(body);
        
        return reply.code(201).send(map);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getMapsHandler() {
    const maps = await findMaps();
    
    return maps;
}

export async function getMapHandler(
    request: FastifyRequest<{
        Params: MapIdParamInput,
    }>,
) {
    const { id } = MapIdParamSchema.parse(request.params)
    console.log(`>getMapHandler`, {id})
    const map = await findMap(id)
    
    return map;
}

export async function putMapHandler(
    request: FastifyRequest<{
        Params: { id: number },
        Body: UpdateMapInput,
    }>,
) {
    const { id } = request.params
    const map = await updateMap(id, request.body)
    
    return map;
}

export async function getMapBuoysHandler(
  request: FastifyRequest<{
        Params: { id: number },
    }>,
) {
  const { id } = request.params
  const ships = await findBuoysByMapId(id)
  
  return ships;
}

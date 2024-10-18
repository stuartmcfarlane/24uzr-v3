import { FastifyReply, FastifyRequest } from "fastify";
import { CreateShipInput, ShipIdParamInput, ShipIdParamSchema, UpdateShipInput } from "./ship.schema";
import { createShip, findShip, findShips, updateShip } from "./ship.service";

export async function createShipHandler(
    request: FastifyRequest<{
        Body: CreateShipInput;
    }>,
    reply: FastifyReply
) {
    const body = request.body;
    
    try {
        const ship = await createShip(body);
        
        return reply.code(201).send(ship);
    } catch (e) {
        return reply.code(500).send(e);
    }
}

export async function getShipsHandler() {
    const ships = await findShips();
    
    return ships;
}

export async function getShipHandler(
    request: FastifyRequest<{
        Params: ShipIdParamInput,
    }>,
) {
    const { id } = ShipIdParamSchema.parse(request.params)
    const ship = await findShip(id)
    
    return ship;
}

export async function putShipHandler(
    request: FastifyRequest<{
        Params: ShipIdParamInput,
        Body: UpdateShipInput,
    }>,
) {
    const { id } = ShipIdParamSchema.parse(request.params)
    const ship = await updateShip(id, request.body)
    
    return ship;
}
"use server"

import { ActionError } from "@/types/action"
import { getSession } from "./session"
import { apiCreateShip, apiGetShipsByOwner, apiUpdateShip } from "@/services/api"
import { formData2polarCsv } from "tslib"
import { redirect } from "next/navigation"
import { IApiShipOutput } from "@/types/api"
import { isActive } from "@/lib/ships"

export const createShipWithForm = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const name = formData.get("name") as string
    const sailNumber = formData.get("sailNumber") as string
    const ownerId = parseInt(formData.get("ownerId") as string)

    if (!name) {
        return { error: "Name is missing" }
    }
    if (!ownerId) {
        return { error: "Owner is missing" }
    }
    
    const createdShip = await apiCreateShip(session.apiToken!, {
        name,
        sailNumber,
        isActive: false,
        ownerId,
        polar: ''
    })
    if (!createdShip) return { error: "Failed to create ship" }

    redirect(`/ship/${createdShip.id}`)
}
export const updateShipPolar = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()
    const id = parseInt(formData.get('id') as string)
    formData.delete('id')
    const polar = formData2polarCsv(formData)
    const updatedShip = await apiUpdateShip(session.apiToken!, id, {
        polar
    })
    return {}
}

export const updateActiveShip = async (ownerId: number, ship?: IApiShipOutput) => {
    const apiToken = await (await getSession()).apiToken
    if (!apiToken) return

    const ships = await apiGetShipsByOwner(apiToken, ownerId) || []
    const oldActiveShips = ships.filter(isActive)
    await Promise.all(
        oldActiveShips.map((ship?: IApiShipOutput) => ship && apiUpdateShip(apiToken!, ship.id, { isActive: false }))
    )
    if (!ship) return
    return await apiUpdateShip(apiToken, ship.id, { isActive: true })
}
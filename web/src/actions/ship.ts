"use server"

import { ActionError } from "@/types/action"
import { getSession } from "./session"
import { apiCreateShip, apiUpdateShip } from "@/services/api"
import { formData2polarCsv } from "@/lib/shipPolar"
import { redirect } from "next/navigation"

export const createShipWithForm = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const name = formData.get("name") as string
    const ownerId = parseInt(formData.get("ownerId") as string)
    console.log(`create ship`, {name, ownerId})

    if (!name) {
        return { error: "Name is missing" }
    }
    if (!ownerId) {
        return { error: "Owner is missing" }
    }
    
    const createdShip = await apiCreateShip(session.apiToken!, {
        name,
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
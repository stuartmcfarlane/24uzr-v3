"use server"

import { getSession } from './session';
import { apiCreateBuoy, apiCreateMap, apiUpdateBuoy } from '@/services/api';
import { ActionError } from '@/types/action';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createMap = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const formName = formData.get("name") as string

    if (!formName) {
        return { error: "Name is missing" }
    }
    
    const createdMap = await apiCreateMap(session.apiToken!, {
        name: formName,
    })
    if (!createdMap) return { error: "Failed to create map" }

    redirect(`/map/${createdMap.id}`)
}

export const createBuoy = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const formName = formData.get("name") as string
    const formLat = parseFloat(formData.get("lat") as string)
    const formLng = parseFloat(formData.get("lng") as string)
    const formMapId = parseInt(formData.get("mapId") as string)

    const buoy = {
        name: formName,
        lat: formLat,
        lng: formLng,
        mapId: formMapId,
    }

    if (!formName || isNaN(formLat) || isNaN(formLng)) {
        return { error: "Missing data" }
    }
    const createdBuoy = await apiCreateBuoy(session.apiToken!, buoy)
    if (!createdBuoy) return { error: "Failed to create buoy" }

    revalidatePath(`/map/${formMapId}`)

    return {}
}
export const updateBuoy = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const formId = parseInt(formData.get("id") as string)
    const formName = formData.get("name") as string
    const formLat = parseFloat(formData.get("lat") as string)
    const formLng = parseFloat(formData.get("lng") as string)
    const formMapId = parseInt(formData.get("mapId") as string)

    if (isNaN(formId) || !formName || isNaN(formLat) || isNaN(formLng) || isNaN(formMapId)) {
        return { error: "Missing data" }
    }

    const updatedBuoy = await apiUpdateBuoy(session.apiToken!, formId, {
        name: formName,
        lat: formLat,
        lng: formLng,
        mapId: formMapId,
    })
    if (!updatedBuoy) return { error: "Failed to create buoy" }

    revalidatePath(`/map/${formMapId}`)

    return {}
}
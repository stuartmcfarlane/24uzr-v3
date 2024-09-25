"use server"

import { getSession } from './session';
import { apiCreateBuoy, apiCreateLeg, apiCreateMap, apiDeleteBuoy, apiGetBuoys, apiGetLegs, apiUpdateBuoy, apiUpdateLeg, apiUpdateMap } from '@/services/api';
import { ActionError } from '@/types/action';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { IApiBuoyInput, IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapOutput } from '../types/api';
import { parseNameLatLng } from '@/lib/parsers';
import { project, truthy, unique } from '@/lib/fp';
import { notEmpty } from '../lib/fp';

export const createMapWithForm = async (formData: FormData): Promise<ActionError> => {
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
export const updateMap = async (id: number, map: IApiMapOutput): Promise<ActionError> => {
    const session = await getSession()


    const updatedMap = await apiUpdateMap(session.apiToken!, id, map)
    if (!updatedMap) return { error: "Failed to update map" }

    revalidatePath(`/map/${id}`)

    return {}
}

export const createLeg = async (leg: IApiLegInput): Promise<ActionError> => {
    const session = await getSession()

    const createdLeg = await apiCreateLeg(session.apiToken!, leg)
    if (!createdLeg) return { error: "Failed to create leg" }

    revalidatePath(`/map/${leg.mapId}`)

    return {}
}
export const createLegs = async (legs: IApiLegInput[]): Promise<IApiLegOutput[]> => {
    const session = await getSession()

    const mapIds = unique(legs.map(project('mapId')))

    const createdLegs = await Promise.all(
        legs.map(
            (leg) => apiCreateLeg(session.apiToken!, leg)
        )
    )

    mapIds.forEach(mapId => revalidatePath(`/map/${mapId}`))

    return createdLegs.filter(notEmpty)
}
export const getLegs = async (mapId: number): Promise<IApiLegOutput[]> => {
    const session = await getSession()

    const legs = await apiGetLegs(session.apiToken!, mapId)

    return legs || []
}
export const updateLeg = async (id: number, leg: IApiLegInput): Promise<IApiLegOutput | null> => {
    const session = await getSession()

    const updatedLeg = await apiUpdateLeg(session.apiToken!, id, leg)

    return updatedLeg
}
export const getBuoys = async (mapId: number): Promise<IApiBuoyOutput[]> => {
    const session = await getSession()

    const buoys = await apiGetBuoys(session.apiToken!, mapId)

    return buoys || []
}
export const createBuoyWithForm = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const formName = formData.get("name") as string
    const formNameLatLng = formData.get("nameLatLng") as string
    const formLat = parseFloat(formData.get("lat") as string)
    const formLng = parseFloat(formData.get("lng") as string)
    const formMapId = parseInt(formData.get("mapId") as string)

    const nameLatLng = parseNameLatLng(formNameLatLng)

    const buoy = {
        name: nameLatLng ? nameLatLng.name : formName,
        lat: nameLatLng ? nameLatLng.lat : formLat,
        lng: nameLatLng ? nameLatLng.lng : formLng,
        mapId: formMapId,
    }

    if (!buoy.name || isNaN(buoy.lat) || isNaN(buoy.lng)) {
        return { error: "Missing data" }
    }
    const createdBuoy = await apiCreateBuoy(session.apiToken!, buoy)
    if (!createdBuoy) return { error: "Failed to create buoy" }

    revalidatePath(`/map/${formMapId}`)

    return {}
}
export const createBuoys = async (buoys: IApiBuoyInput[]): Promise<IApiBuoyOutput[]> => {
    const session = await getSession()

    const mapIds = unique(buoys.map(project('mapId')))

    const createdBuoys = await Promise.all(
        buoys.map(
            (buoy) => apiCreateBuoy(session.apiToken!, buoy)
        )
    )

    mapIds.forEach(mapId => revalidatePath(`/map/${mapId}`))

    return createdBuoys.filter(notEmpty)
}
export const updateBuoy = async (id: number, buoy: IApiBuoyInput): Promise<IApiBuoyOutput | null> => {
    const session = await getSession()

    const updatedBuoy = await apiUpdateBuoy(session.apiToken!, id, buoy)

    return updatedBuoy
}
export const updateBuoyWithForm = async (formData: FormData): Promise<ActionError> => {
    const formId = parseInt(formData.get("id") as string)
    const formName = formData.get("name") as string
    const formLat = parseFloat(formData.get("lat") as string)
    const formLng = parseFloat(formData.get("lng") as string)
    const formMapId = parseInt(formData.get("mapId") as string)

    if (isNaN(formId) || !formName || isNaN(formLat) || isNaN(formLng) || isNaN(formMapId)) {
        return { error: "Missing data" }
    }

    const updatedBuoy = await updateBuoy(formId, {
        name: formName,
        lat: formLat,
        lng: formLng,
        mapId: formMapId,
    })
    if (!updatedBuoy) return { error: "Failed to update buoy" }

    revalidatePath(`/map/${formMapId}`)

    return {}
}
export const deleteBuoy = async ({
    id,
    mapId,
}: {
        id: number,
        mapId: number
}
): Promise<ActionError> => {
    const session = await getSession()

    await apiDeleteBuoy(session.apiToken!, id)

    revalidatePath(`/map/${mapId}`)

    return {}
}
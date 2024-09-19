"use server"

import { getSession } from './session';
import { apiCreateMap } from '@/services/api';
import { ActionError } from '@/types/action';
import { redirect } from 'next/navigation';

export const createMap = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const formName = formData.get("name") as string

    if (!formName) {
        return { error: "Name is missing" }
    }
    
    const createdMap = await apiCreateMap(session.apiToken!, {
        name: formName,
    }
    )
    if (!createdMap) return { error: "Failed to create map" }

    redirect(`/map/${createdMap.id}`)
}
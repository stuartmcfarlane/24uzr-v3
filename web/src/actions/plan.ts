"use server"

import { ActionError } from "@/types/action"
import { getSession } from "./session"
import { apiCreatePlan, apiGetPlan } from "@/services/api"
import { redirect } from "next/navigation"
import { hours2seconds, now, timestamp2string } from "tslib"

export const createPlanWithForm = async (formData: FormData): Promise<ActionError> => {
    const session = await getSession()

    const name = formData.get("name") as string
    const defaultName = formData.get("defaultName") as string
    const mapId = parseInt(formData.get("mapId") as string)
    const shipId = parseInt(formData.get("shipId") as string)
    const startBuoyId = parseInt(formData.get("startBuoyId") as string)
    const endBuoyId = parseInt(formData.get("endBuoyId") as string)
    const raceSecondsRemaining = parseInt(formData.get("raceSecondsRemaining") as string)
    const raceHoursRemaining = parseInt(formData.get("raceHoursRemaining") as string)
    const startTime = formData.get("startTime") as string
    const rootPage = formData.get("rootPage") as string

    if (!session.userId ||
        !mapId ||
        !shipId ||
        !startBuoyId ||
        !endBuoyId
    ) {
        return { error: "Missing data" }
    }
    if (!name && !defaultName) {
        return { error: "Missing data" }
    }
    
    const createdPlan = await apiCreatePlan(session.apiToken!, {
        name: name || defaultName,
        ownerId: session.userId,
        mapId,
        shipId,
        startBuoyId,
        endBuoyId,
        startTime: startTime || timestamp2string(now()),
        raceSecondsRemaining: raceSecondsRemaining ? raceHoursRemaining * 60 * 60 : hours2seconds(8),
    })
    if (!createdPlan) return { error: "Failed to create plan" }

    redirect(`${rootPage}/plan/${createdPlan.id}`)
}

export const getPlan = async (planId: number) => {
    const session = await getSession()
    return apiGetPlan(session.apiToken!, planId)
}
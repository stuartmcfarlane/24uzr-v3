"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "./session"
import { apiCreateGeometry } from "@/services/api"

export async function uploadGeoJson(formData: FormData) {
    const file = formData.get("file") as File
    const mapId = parseInt(formData.get("mapId") as string)

    const buffer = Buffer.from(await file.arrayBuffer());

    const session = await getSession()

    const json = buffer.toString()

    const geojson = JSON.parse(json)

    await apiCreateGeometry(session.apiToken!, {
        mapId,
        name: file.name,
        geojson
    })
    
    revalidatePath(`/map/${mapId}`)
}
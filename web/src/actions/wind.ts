"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "./session"
import { apiCreateWind } from "@/services/api"

export async function uploadWindJson(formData: FormData) {
    console.log(`>uploadWindJson`)
    const file = formData.get("file") as File
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(await file.arrayBuffer());
    // const buffer = new Uint8Array(arrayBuffer)

    const session = await getSession()

    const json = buffer.toString()

    const winds = JSON.parse(json)

    await apiCreateWind(session.apiToken!, winds)
    
    revalidatePath("/wind")
}
"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "./session"
import { apiCreateWind } from "@/services/api"

export async function uploadWindJson(formData: FormData) {
    const file = formData.get("file") as File
    const buffer = Buffer.from(await file.arrayBuffer());

    const session = await getSession()

    const json = buffer.toString()

    const winds = JSON.parse(json)

    await apiCreateWind(session.apiToken!, winds)
    
    revalidatePath("/wind")
}
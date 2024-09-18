import { cookies } from "next/headers"

export function getCookie(key: string) {
    console.log(`>getCookie ${key}`)

    const isClient = (typeof window)
    console.log(` getCookie ${key} client: ${isClient}`)

    throw new Error("This shit does not work")
    const result = (
        isClient
            ? ''
            : require('next/headers')().get(key)
    )
    console.log(`<getCookie ${key}: ${result}`)

    return result
}
import { CookieListItem } from "next/dist/compiled/@edge-runtime/cookies"

export function setCookie(key: string, value: string, options?: object) {
    console.log(`>setCookie ${key}, ${value}`, options)

    const isClient = (typeof window)
    if (isClient) return

    require('next/headers')().set(key, value, options)
    console.log(`<setCookie ${key}`)
}
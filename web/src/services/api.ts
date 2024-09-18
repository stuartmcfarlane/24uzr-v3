import { IUser } from "@/types/user"

const makeApiUrl = (uri: string) => `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL}${uri}`

const get = async (uri: string) => {
    return await fetch(makeApiUrl(uri), {
        method: 'GET',
        credentials: "include",
    })
}

const post = async (uri: string, data: object) => {
    return await fetch(makeApiUrl(uri), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(data),
    })
}

export const register = async ({
    email,
    password,
    name
}: {
    email: string,
    password: string,
    name: string
    }
): Promise<boolean> => {
    const response = await post(`/api/register`, { email, password, name })
    
    return response.ok
}

export const login = async ({
    email,
    password
}: {
    email: string,
    password: string
    }
): Promise<boolean> => {
    const response = await post(`/api/login`, { email, password })
    
    return response.ok
}

export const getUser = async (): Promise<IUser> => {
    const response = await get(`/api/user`)
    
    if (!response.ok) throw Error("Not logged in")
    
    const user = await response.json()
    return user
}

export const getMaps = async () => {
    const response = await get(`/api/maps`)

    if (!response.ok) return []
    
    const maps = await response.json()

    return  maps
}

export const getMap = async (id: number) => {
    const response = await get(`/api/map/${id}`)

    if (!response.ok) return []
    
    const map = await response.json()

    return  map
}

export const createtMap = async ({
    name,
}: {
    name: string
    }) => {
    console.log(`>createMap`)
    const response = await post(`/api/map`, {name})

    if (!response.ok) throw new Error("Failed to create map")
    
    const map = await response.json()
    console.log(`<createMap`, map)
    return map
}
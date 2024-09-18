import { IUser } from "@/types/user"
import { getCookie } from '../lib/getCookie'

const makeApiUrl = (uri: string) => `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL}${uri}`

const get = async (uri: string) => {
    const webToken = getCookie('webToken') // cookies().get('webToken')
    const options = {
        method: 'GET',
        // credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${webToken}`,
        }
    }
    console.log(`get ${uri}`, options)
    return await fetch(makeApiUrl(uri), options)
    // return await fetch(makeApiUrl(uri), {
    //     method: 'GET',
    //     credentials: "include",
    //     headers: {
    //         'Accept': 'application/json',
    //         'Authorization': `Bearer ${webToken}`,
    //     }
    // })
}

const post = async (uri: string, data: object) => {
    const webToken = getCookie('webToken') // cookies().get('webToken')
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${webToken}`,
        },
        // credentials: "include",
        body: JSON.stringify(data),
    }
    console.log(`post ${uri}`, options)
    return await fetch(makeApiUrl(uri), options)
    // return await fetch(makeApiUrl(uri), {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Authorization': `Bearer ${webToken}`,
    //     },
    //     credentials: "include",
    //     body: JSON.stringify(data),
    // })
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
    console.log(`>register`)
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
) => {
    console.log(`>login`)
    const response = await post(`/api/login`, { email, password })
    if (!response.ok) return {}
    const json = await response.json()
    console.log(` login`, json)
    const { accessToken }: { accessToken: string } = json
    console.log(`<login`, { accessToken })
    return { accessToken }
}

export const getUser = async (): Promise<IUser> => {
    console.log(`>getUser`)
    const response = await get(`/api/user`)
    
    if (!response.ok) throw Error("Not logged in")
    
    const user = await response.json()
    return user
}

export const getMaps = async () => {
    console.log(`>getMaps`)
    const response = await get(`/api/maps`)

    if (!response.ok) return []
    
    const maps = await response.json()

    return  maps
}

export const getMap = async (id: number) => {
    console.log(`>getMap`)
    const response = await get(`/api/map/${id}`)

    if (!response.ok) return []
    
    const map = await response.json()

    return  map
}

export const createMap = async ({
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
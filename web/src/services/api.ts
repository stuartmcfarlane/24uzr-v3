import { IApiMapInput, IApiMapOutput, IApiUser } from "@/types/api"

const makeApiUrl = (uri: string) => `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL}${uri}`

const get = async (uri: string, accessToken?: string) => {
    console.log(`>get ${uri}`, accessToken)
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            ...(accessToken ? {'Authorization': `Bearer ${accessToken}`} : {}),
        }
    }
    console.log(` get ${uri}`, options)
    return await fetch(makeApiUrl(uri), options)
}

const post = async (uri: string, data: object, accessToken?: string) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(accessToken ? {'Authorization': `Bearer ${accessToken}`} : {}),
        },
        body: JSON.stringify(data),
    }
    console.log(`post ${uri}`, options)
    return await fetch(makeApiUrl(uri), options)
}

export const apiRegister = async ({
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

export const apiLogin = async ({
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

export const apiGetUser = async (accessToken?: string): Promise<IApiUser | null> => {
    console.log(`>getUser`)
    const response = await get(`/api/user`, accessToken)
    
    if (!response.ok) return null
    
    const user = await response.json()
    return user
}

export const apiGetMaps = async (
    accessToken?: string
): Promise<IApiMapOutput[] | null> => {

    console.log(`>getMaps`)
    const response = await get(`/api/maps`, accessToken)

    if (!response.ok) return []
    
    const maps = await response.json()

    return  maps
}

export const apiGetMap = async (
    id: number,
    accessToken?: string
): Promise<IApiMapOutput | null> => {

    console.log(`>getMap`)
    const response = await get(`/api/map/${id}`, accessToken)

    if (!response.ok) return null
    
    const map = await response.json()

    return  map
}

export const apiCreateMap = async (
    map: IApiMapInput,
    accessToken?: string
): Promise<IApiMapOutput | null> => {

    console.log(`>createMap`)
    const response = await post(`/api/map`, map, accessToken)

    if (!response.ok) return null
    
    const createdMap = await response.json()
    console.log(`<createMap`, createdMap)
    return createdMap
}

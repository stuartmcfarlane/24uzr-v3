import { IApiBuoyInput, IApiBuoyOutput, IApiMapInput, IApiMapOutput, IApiUser, IApiUserOutput } from "@/types/api"

const makeApiUrl = (uri: string) => `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL}${uri}`

const get = async (accessToken: string | undefined, uri: string) => {
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

const post = async (accessToken: string | undefined, uri: string, data: object) => {
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
    const response = await post(undefined, `/api/register`, { email, password, name })
    
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

    const response = await post(undefined, `/api/login`, { email, password })

    if (!response.ok) return {}

    const json = await response.json()
    console.log(` login`, json)

    const { accessToken }: { accessToken: string } = json
    console.log(`<login`, { accessToken })

    return { accessToken }
}

export const apiGetUsers = async (
    accessToken: string
): Promise<IApiUserOutput[] | null> => {

    console.log(`>getUsers`)
    const response = await get(accessToken, `/api/users`)

    if (!response.ok) return []
    
    const users = await response.json()

    return  users
}

export const apiGetUser = async (accessToken: string, id?: number): Promise<IApiUserOutput | null> => {
    console.log(`>getUser`)
    const response = await get(accessToken, id ? `/api/user/${id}` : `/api/user`)
    
    if (!response.ok) return null
    
    const user = await response.json()
    return user
}

export const apiGetMaps = async (
    accessToken: string
): Promise<IApiMapOutput[] | null> => {

    console.log(`>getMaps`)
    const response = await get(accessToken, `/api/maps`)

    if (!response.ok) return []
    
    const maps = await response.json()

    return  maps
}

export const apiGetMap = async (
    accessToken: string,
    id: number,
): Promise<IApiMapOutput | null> => {

    console.log(`>getMap`)
    const response = await get(accessToken, `/api/map/${id}`)

    if (!response.ok) return null
    
    const map = await response.json()

    return  map
}

export const apiCreateMap = async (
    accessToken: string,
    map: IApiMapInput,
): Promise<IApiMapOutput | null> => {

    console.log(`>createMap`)
    const response = await post(accessToken, `/api/maps`, map)

    if (!response.ok) return null
    
    const createdMap = await response.json()
    console.log(`<createMap`, createdMap)
    return createdMap
}

const withNumericLatLng = ({ lat, lng, ...rest }: MaybeLatLng): LatLng => ({
    ...rest,
    lat: typeof lat === 'string' ? parseFloat(lat) : lat,
    lng: typeof lng === 'string' ? parseFloat(lng) : lng,
})

export const apiCreateBuoy = async (
    accessToken: string,
    buoy: IApiBuoyInput,
): Promise<IApiBuoyOutput | null> => {

    console.log(`>createBuoy`)
    const response = await post(accessToken, `/api/buoys`, buoy)

    if (!response.ok) return null
    
    const createdBuoy = await response.json()
    const fixedBuoy = withNumericLatLng(createdBuoy)
    console.log(`<createBuoy`, fixedBuoy)
    return fixedBuoy
}

export const apiGetBuoys = async (
    accessToken: string,
    mapId: number,
): Promise<IApiBuoyOutput[] | null> => {

    console.log(`>getBuoys`)
    const response = await get(accessToken, `/api/map/${mapId}/buoys`)

    if (!response.ok) return null
    
    const buoys = await response.json()

    return  buoys.map(withNumericLatLng)
}


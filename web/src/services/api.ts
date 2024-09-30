import { IApiBuoyInput, IApiBuoyOutput, IApiLegInput, IApiLegOutput, IApiMapInput, IApiMapOutput, IApiPlanInput, IApiPlanOutput, IApiRouteInput, IApiRouteLegOutput, IApiRouteOutput, IApiUser, IApiUserOutput } from "@/types/api"

const makeApiUrl = (uri: string) => `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL}${uri}`

const get = async (accessToken: string | undefined, uri: string) => {
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            ...(accessToken ? {'Authorization': `Bearer ${accessToken}`} : {}),
        }
    }
    return await fetch(makeApiUrl(uri), options)
}

const del = async (accessToken: string | undefined, uri: string) => {
    const options = {
        method: 'DELETE',
        headers: {
            ...(accessToken ? {'Authorization': `Bearer ${accessToken}`} : {}),
        }
    }
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
    return await fetch(makeApiUrl(uri), options)
}

const put = async (accessToken: string | undefined, uri: string, data: object) => {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(accessToken ? {'Authorization': `Bearer ${accessToken}`} : {}),
        },
        body: JSON.stringify(data),
    }
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

    const response = await post(undefined, `/api/login`, { email, password })

    if (!response.ok) return {}

    const json = await response.json()

    const { accessToken }: { accessToken: string } = json

    return { accessToken }
}

export const apiGetUsers = async (
    accessToken: string
): Promise<IApiUserOutput[] | null> => {

    const response = await get(accessToken, `/api/users`)

    if (!response.ok) return []
    
    const users = await response.json()

    return  users
}

export const apiGetUser = async (accessToken: string, id?: number): Promise<IApiUserOutput | null> => {
    const response = await get(accessToken, id ? `/api/user/${id}` : `/api/user`)
    
    if (!response.ok) return null
    
    const user = await response.json()
    return user
}

export const apiGetMaps = async (
    accessToken: string
): Promise<IApiMapOutput[] | null> => {

    const response = await get(accessToken, `/api/maps`)

    if (!response.ok) return []
    
    const maps = await response.json()

    return  maps
}

export const apiGetMap = async (
    accessToken: string,
    id: number,
): Promise<IApiMapOutput | null> => {

    const response = await get(accessToken, `/api/map/${id}`)

    if (!response.ok) return null
    
    const map = await response.json()

    return  map
}

export const apiCreateMap = async (
    accessToken: string,
    map: IApiMapInput,
): Promise<IApiMapOutput | null> => {

    const response = await post(accessToken, `/api/maps`, map)

    if (!response.ok) return null
    
    const createdMap = await response.json()
    return createdMap
}
export const apiUpdateMap = async (
    accessToken: string,
    id: number,
    map: IApiMapInput,
): Promise<IApiMapOutput | null> => {

    const response = await put(accessToken, `/api/map/${id}`, map)

    if (!response.ok) return null
    
    const updatedMap = await response.json() as IApiMapOutput
    return updatedMap
}

const withNumericLatLng = (
    {
        lat,
        lng,
        ...rest
    }: MaybeLatLng & IApiBuoyOutput
): IApiBuoyOutput => ({
    ...rest,
    lat: typeof lat === 'string' ? parseFloat(lat) : lat,
    lng: typeof lng === 'string' ? parseFloat(lng) : lng,
})

export const apiCreateBuoy = async (
    accessToken: string,
    buoy: IApiBuoyInput,
): Promise<IApiBuoyOutput | null> => {

    const response = await post(accessToken, `/api/buoys`, buoy)

    if (!response.ok) return null
    
    const createdBuoy = await response.json() as IApiBuoyOutput
    const fixedBuoy = withNumericLatLng(createdBuoy)
    return fixedBuoy
}

export const apiUpdateBuoy = async (
    accessToken: string,
    id: number,
    buoy: IApiBuoyInput,
): Promise<IApiBuoyOutput | null> => {

    const response = await put(accessToken, `/api/buoy/${id}`, buoy)

    if (!response.ok) return null
    
    const updatedBuoy = await response.json() as IApiBuoyOutput
    const fixedBuoy = withNumericLatLng(updatedBuoy)
    return fixedBuoy
}
export const apiDeleteBuoy = async (
    accessToken: string,
    id: number,
): Promise<void> => {

    await del(accessToken, `/api/buoy/${id}`)
}

export const apiGetBuoys = async (
    accessToken: string,
    mapId: number,
): Promise<IApiBuoyOutput[] | null> => {

    const response = await get(accessToken, `/api/map/${mapId}/buoys`)

    if (!response.ok) return null
    
    const buoys = await response.json()

    return  buoys.map(withNumericLatLng)
}

export const apiCreateLeg = async (
    accessToken: string,
    leg: IApiLegInput,
): Promise<IApiLegOutput | null> => {

    const response = await post(accessToken, `/api/legs`, leg)

    if (!response.ok) return null
    
    const createdLeg = await response.json() as IApiLegOutput
    return createdLeg
}

export const apiUpdateLeg = async (
    accessToken: string,
    id: number,
    leg: IApiLegInput,
): Promise<IApiLegOutput | null> => {

    const response = await put(accessToken, `/api/leg/${id}`, leg)

    if (!response.ok) return null
    
    const updatedLeg = await response.json() as IApiLegOutput
    return updatedLeg
}

export const apiGetLegs = async (
    accessToken: string,
    mapId: number,
): Promise<IApiLegOutput[] | null> => {

    const response = await get(accessToken, `/api/map/${mapId}/legs`)

    if (!response.ok) return null
    
    const legs = await response.json()

    return  legs
}

export const apiGetRoutes = async (
    accessToken: string,
    mapId: number,
): Promise<IApiRouteOutput[] | null> => {

    const response = await get(accessToken, `/api/map/${mapId}/routes`)

    if (!response.ok) return null
    
    const routes = await response.json()
    console.log(`<getRoutes`, routes)

    return  routes
}

export const apiGetRoute = async (
    accessToken: string,
    routeId: number,
): Promise<IApiRouteOutput | null> => {

    const response = await get(accessToken, `/api/route/${routeId}`)

    if (!response.ok) return null
    
    const route = await response.json()
    console.log(`<getRoute`, route)

    return route
}

export const apiGetRouteLegs = async (
    accessToken: string,
    routeId: number,
): Promise<IApiRouteLegOutput[]> => {

    const response = await get(accessToken, `/api/route/${routeId}/legs`)

    if (!response.ok) return []
    
    const routeLegs = await response.json()

    return routeLegs
}

export const apiCreateRoute = async (
    accessToken: string,
    route: IApiRouteInput,
): Promise<IApiRouteOutput | null> => {

    const response = await post(accessToken, `/api/routes`, route)

    if (!response.ok) return null
    
    const createdRoute = await response.json() as IApiRouteOutput
    return createdRoute
}

export const apiGetPlans = async (
    accessToken: string,
    mapId: number,
): Promise<IApiPlanOutput[] | null> => {

    const response = await get(accessToken, `/api/map/${mapId}/plans`)

    if (!response.ok) return null
    
    const plans = await response.json()
    console.log(`<getPlans`, plans)

    return  plans
}

export const apiCreatePlan = async (
    accessToken: string,
    plan: IApiPlanInput,
): Promise<IApiPlanOutput | null> => {

    const response = await post(accessToken, `/api/plans`, plan)

    if (!response.ok) return null
    
    const createdPlan = await response.json() as IApiPlanOutput
    return createdPlan
}

export const apiGetPlan = async (
    accessToken: string,
    planId: number,
): Promise<IApiPlanOutput | null> => {

    const response = await get(accessToken, `/api/plan/${planId}`)

    if (!response.ok) return null
    
    const plan = await response.json()
    console.log(`<getPlan`, plan)

    return plan
}


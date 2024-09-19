"use server"
// import 'server-only'

import { cookies } from 'next/headers'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
// import { SessionPayload } from '@/lib/definitions'
import { getUser as apiGetUser } from '@/services/api'

type AccessTokenPayload = {
    id: number
    email: string
    name: string
}

type SessionPayload = {
    userId: number
    accessToken: string
    expiresAt: Date
}


export async function createSession(accessToken: string) {
    console.log(`>createSession`, accessToken)
    const userId = await userIdFromAccessToken(accessToken)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt, accessToken })
    
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
    cookies().set('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function userIdFromAccessToken(accessToken: string) {
    
    const apiPayload = await decrypt(accessToken) as AccessTokenPayload & JWTPayload
    console.log(`createSessionFromApiToken`, apiPayload)
    return apiPayload?.id
}

export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie) as SessionPayload
    console.log('verifySession ', session)
    
    if (!session?.userId) {
        // redirect('/login')
    }
    
    return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null
    
    try {
        const user = apiGetUser()
        return null
        // const data = await db.query.users.findMany({
        //   where: eq(users.id, session.userId),
        //   // Explicitly return the columns you need rather than the whole user object
        //   columns: {
        //     id: true,
        //     name: true,
        //     email: true,
        //   },
        // })
        
        // const user = data[0]
        
        // return user
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
        return ''
    }
}

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function recoverSessionCookieFromThisRequest(response: Response): Promise<ResponseCookie | null> {
    const cookies = response.headers.getSetCookie()
    const setWebTokenCookie = cookies.find(c => /session/.test(c))
    const parsed = /^session=(.*)$/.exec(setWebTokenCookie || 'session=')
    const parts = parsed && parsed[1].split(';')
    const webToken = parts && parts[0]
    
    if (!webToken) return null
    
    return {
        name: 'session',
        value: webToken,
        httpOnly: true,
        secure: true,
        path: "/",
    }
}

export async function recoverAccessTokenCookie(response: Response): Promise<string> {
    const cookies = response.headers.getSetCookie()
    const setAccessTokenCookie = cookies.find(c => /access_token/.test(c))
    const parsed = /^access_token=(.*)$/.exec(setAccessTokenCookie || 'session=')
    const parts = parsed && parsed[1].split(';')
    const accessToken = parts && parts[0]
    
    return accessToken || ''
}

export async function recoverCookieDataFromThisRequest(cookie: string, response: Response): Promise<string> {
    const cookies = response.headers.getSetCookie()
    const regexCookie = RegExp(cookie)
    const regexData = RegExp(`^${cookie}=(.*)$`)
    const setCookie = cookies.find(c => regexCookie.test(c))
    const parsed = regexData.exec(setCookie || `${cookie}=`)
    const parts = parsed && parsed[1].split(';')
    const value = parts && parts[0]
    
    console.log('<recoverCookieDataFromThisRequest', value)
    return value || ''
}

import 'server-only'
 
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

export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
 
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function createSessionFromApiToken(accessToken: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    
    const apiToken = await decrypt(accessToken) as AccessTokenPayload & JWTPayload
    console.log(`createSessionFromApiToken`, apiToken)
    
    // const session = await encrypt({ userId: 1, expiresAt })
    const session = await encrypt({ userId: apiToken?.id, expiresAt })
 
    console.log(`createSessionFromApiToken`, await decrypt(session))

    cookies().set('session', session, {
        httpOnly: true,
        // secure: true,
        expires: expiresAt,
        // sameSite: 'lax',
        path: '/',
    })
}

export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)
    console.log('verifySession ', session)
 
  if (!session?.userId) {
    // redirect('/login')
  }
 
  return { isAuth: true, userId: 1 }
//   return { isAuth: true, userId: session.userId }
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

type SessionPayload = {
  userId: number
  expiresAt: Date
}

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
  }
}

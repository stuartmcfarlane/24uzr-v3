import { SessionOptions } from "iron-session"

export interface ISessionData {
    isLoggedIn: boolean
    userId?: number
    name?: string
    email?: string
    isAdmin?: boolean
    apiToken?: string
}

export const defaultSession: ISessionData = {
    isLoggedIn: false
}
export const sessionOptions: SessionOptions = {
    password: process.env.IRON_SESSION_PASSWORD!,
    cookieName: '24uzr-session',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
}
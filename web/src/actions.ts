"use server"

import { getIronSession } from 'iron-session';
import { defaultSession, ISessionData, sessionOptions } from './lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { IApiUser, IApiUserCredentials } from './types/user';
import { apiGetUser, apiLogin } from './services/api';

export const getSession = async () => {
    const session = await getIronSession<ISessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn
    }
    return session
}

let apiUsers: {[key: string]: IApiUser & IApiUserCredentials} = {
    'stuart@mcfarlane.nl': {
        id: 1,
        email: 'stuart@mcfarlane.nl',
        password: 'secret',
        isAdmin: true,
        name: "Stuart",
    }
}
export const login = async (
    prevState: { error: undefined | string },
    formData: FormData
) => {
    const session = await getIronSession<ISessionData>(cookies(), sessionOptions)

    const formEmail = formData.get("email") as string
    const formPassword = formData.get("password") as string

    if (!formEmail || !formPassword) {
        return {error: "Missing credentials"}
    }
    // verify user at API
    // const apiUser = apiUsers[formEmail]

    // if (!apiUser) {
    //     return { error: "Bad credentials"}
    // }
    const { accessToken } = await apiLogin({
        email: formEmail,
        password: formPassword,
    })
    if (!accessToken) {
        return { error: "Bad credentials"}
    }

    session.apiToken = accessToken

    await session.save()

    const apiUser = await apiGetUser(session.apiToken)
    if (!apiUser) {
        return { error: "Bad credentials"}
    }    
    session.userId = apiUser.id
    session.email = apiUser.email
    session.name = apiUser.name
    session.isAdmin = apiUser.isAdmin
    session.isLoggedIn = true
    
    await session.save()

    redirect('/profile')
}
export const logout = async () => {
    const session = await getIronSession<ISessionData>(cookies(), sessionOptions)

    session.destroy()
}
export const signup = async (
    prevState: { error: undefined | string },
    formData: FormData
) => {
    const session = await getIronSession<ISessionData>(cookies(), sessionOptions)

    const formName = formData.get("name") as string
    const formEmail = formData.get("email") as string
    const formPassword = formData.get("password") as string

    // verify user at API
    if (!formEmail || !formPassword) {
        return {error: "Missing credentials"}
    }
    if (apiUsers[formEmail]) {
        return { error: "Email already in use"}
    }

    const apiUser: IApiUser & IApiUserCredentials = {
        id: Object.keys(apiUsers).length,
        email: formEmail,
        password: formPassword,
        name: formName,
        isAdmin: false,
    }

    apiUsers[formEmail] = apiUser

    session.userId = apiUser.id
    session.email = apiUser.email
    session.name = apiUser.name
    session.isAdmin = apiUser.isAdmin
    session.isLoggedIn = true
    
    await session.save()

    console.log('users', apiUsers)

    redirect('/profile')
}

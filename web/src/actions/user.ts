"use server"

import { getIronSession } from 'iron-session';
import { defaultSession, ISessionData, sessionOptions } from '../lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiGetUser, apiLogin, apiRegister } from '../services/api';

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

    redirect('/login')
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

    const registered = await apiRegister({
        email: formEmail,
        password: formPassword,
        name: formName,
    })

    if (!registered) {
        return { error: "Registration failed" }
    }

    redirect('/login')
}

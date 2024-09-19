"use server"

import { getIronSession } from 'iron-session';
import { defaultSession, ISessionData, sessionOptions } from '../lib/session';
import { cookies } from 'next/headers';

export const getSession = async () => {
    const session = await getIronSession<ISessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
        session.isLoggedIn = defaultSession.isLoggedIn
    }
    return session
}

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export function getWebTokenCookie(response: Response): ResponseCookie | null {
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
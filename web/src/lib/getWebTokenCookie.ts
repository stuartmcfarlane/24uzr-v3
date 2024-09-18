import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export function getWebTokenCookie(response: Response): ResponseCookie | null {
    const cookies = response.headers.getSetCookie()
    const setWebTokenCookie = cookies.find(c => /web_token/.test(c))
    const parsed = /^web_token=(.*)$/.exec(setWebTokenCookie || 'web_token=')
    const parts = parsed && parsed[1].split(';')
    const webToken = parts && parts[0]

    if (!webToken) return null

    return {
        name: 'web_token',
        value: webToken,
        httpOnly: true,
        secure: true,
        path: "/",
    }
}
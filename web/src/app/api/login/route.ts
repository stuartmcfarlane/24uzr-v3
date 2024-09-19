"use server"
import { setCookie } from "@/lib/setCookie"
import { cookies } from 'next/headers'
import { login } from "@/services/api"
import { NextRequest, NextResponse } from "next/server"
import { createSession, userIdFromAccessToken } from "@/lib/session"

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
export async function POST(req: NextRequest, res: NextResponse) {
    console.log(`>POST`)
    try {
        const body = await req.json()
        console.log(` POST body`, body)
        const { accessToken } = await login(body)
        if (!accessToken) {
            return NextResponse.json({ error: "login failed" })
        }

        // const userId = await userIdFromAccessToken(accessToken)
        await createSession(accessToken)

        return NextResponse.json({})
    }
    catch (err) {
        console.error(err)
        return new NextResponse(JSON.stringify({ error: "Login failed (API error)" }), {
            headers: { "content-type": "application/json" },
            status: 500,
        })
    }
}

"use server"

import { setCookie } from "@/lib/setCookie";
import { getUser, login } from "../../services/api"
import Link from "next/link";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getCookie } from "@/lib/getCookie";
import { cookies } from "next/headers";
import { getWebTokenCookie } from "@/lib/getWebTokenCookie";

const LoginPage = () => {

    const loginAction = async (formData: FormData) => {
        "use server"

        const email = formData.get('email') as string
        const password = formData.get('password') as string
    
        if (!email || !password) {
            return
        }

        const loginResult = await fetch(`${process.env.ROOT_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const webTokenCookie = getWebTokenCookie(loginResult)
        if (webTokenCookie) {
            cookies().set(webTokenCookie);
            cookies().set({
                ...webTokenCookie,
                name: 'access_token',
            });
        }

        redirect('/dashboard')
    }
    return (
        <div className="h-[calc(100vh-5rem)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form action={loginAction} className="flex flex-col gap-8">
                <h1 className="text-2xl font-semibold">Log in</h1>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@gmail.com"
                            autoComplete="email"
                            className="ring-2 ring-gray-300 rounded-md p-4" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="password"
                            className="ring-2 ring-gray-300 rounded-md p-4" />
                    </div>
                    <Link href="/reset-password" className="text-sm underline cursor-pointer">Forgot your password? Reset.</Link>
                <button
                    className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
                >
                    Log in
                </button>
                    <Link href="/signup" className="text-sm underline cursor-pointer">{"Don't"} have an account? Register.</Link>
            </form>
        </div>
    )
}
export default LoginPage
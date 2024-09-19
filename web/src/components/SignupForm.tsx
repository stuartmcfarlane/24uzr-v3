"use client"

import { signup } from "@/actions"
import Link from "next/link"
import { useFormState } from "react-dom"

const SignupForm = () => {

    const [state, formAction] = useFormState<any, FormData>(signup, undefined)
    return (
        <div className="h-[calc(100vh-5rem)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form action={formAction} className="flex flex-col gap-8">
                <h1 className="text-2xl font-semibold">Sign up</h1>
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="john"
                        autoComplete="name"
                        className="ring-2 ring-gray-300 rounded-md p-4" />
                </div>
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
                <button className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed">
                    Sign up
                </button>
                <p className="text-red-600">{state?.error && state.error}</p>
                <Link href="/login"
                    className="text-sm underline cursor-pointer"
                >
                    Have an account? Login.
                </Link>
            </form>
        </div>
    )
}

export default SignupForm
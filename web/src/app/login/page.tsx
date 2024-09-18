"use client"

import { UserContext } from "@/context/UserContext"
import { ReactEventHandler, useContext, useRef, useState } from "react"
import { UserContextType } from '../../types/user';
import { useRouter } from "next/navigation";
import { getUser, login, register } from "../../services/api"

enum MODE {
    LOGIN="LOGIN",
    REGISTER="REGISTER",
    RESET_PASSWORD="RESET_PASSWORD",
    EMAIL_VERIFICATION="EMAIL_VERIFICATION",
}
const LoginPage = () => {

    const router = useRouter()

    const formRef = useRef<HTMLFormElement>(null)
    const [mode, setMode] = useState(MODE.LOGIN)
    const [name, setName]  = useState("")
    const [email, setEmail]  = useState("")
    const [password, setPassword]  = useState("")
    const [emailCode, setEmailCode]  = useState("")
    const [isLoading, setIsLoading]  = useState(false)
    const [error, setError]  = useState(false)
    const [message, setMessage] = useState(false)

    const {user, setUser} = useContext(UserContext) as UserContextType
    
    const formTitle = (
        mode === MODE.LOGIN ? "Log in"
        : mode === MODE.REGISTER ? "Register"
        : mode === MODE.RESET_PASSWORD ? "Reset your password"
        : mode === MODE.EMAIL_VERIFICATION ? "Verify your email"
        : ""
    )
    const buttonTitle = (
        mode === MODE.LOGIN ? "Login"
        : mode === MODE.REGISTER ? "Register"
        : mode === MODE.RESET_PASSWORD ? "Reset"
        : mode === MODE.EMAIL_VERIFICATION ? "Verify"
        : ""
    )

    const handleLogin = async () => {
        if (!formRef.current) {
            router.push('/')
            return
        }
        const formData = new FormData(formRef.current)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
    
        if (!email || !password) {
            return
        }

        const success = await login({ email, password })
        if (!success) return

        const user = await getUser()
        if (!user) return

        setUser(user)
        router.push('/dashboard')
    }
    const handleRegister = async () => {
        if (!formRef.current) {
            router.push('/')
            return
        }
        const formData = new FormData(formRef.current)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string
    
        if (!email || !password) {
            return
        }

        const success = await register({ email, password, name })
        if (!success) return

        setMode(MODE.LOGIN)
    }
    const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        switch (mode) {
            case MODE.LOGIN:
                await handleLogin()
                break
            case MODE.REGISTER:
                await handleRegister()
                break
            case MODE.RESET_PASSWORD:
                break
            case MODE.EMAIL_VERIFICATION:
                break
            default:
        }
    }
    if (user) {
        router.push("/dashboard")
    }
    return (
        <div className="h-[calc(100vh-5rem)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form ref={formRef} className="flex flex-col gap-8">
                <h1 className="text-2xl font-semibold">{formTitle}</h1>
                {mode === MODE.REGISTER ? (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="john"
                            autoComplete="name"
                            className="ring-2 ring-gray-300 rounded-md p-4" />
                    </div>
                ) : null}
                {mode !== MODE.EMAIL_VERIFICATION ? (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="john@gmail.com"
                            autoComplete="email"
                            className="ring-2 ring-gray-300 rounded-md p-4" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Verification code</label>
                        <input type="text" name="emailCode" placeholder="Code" className="ring-2 ring-gray-300 rounded-md p-4" />
                    </div>                        
                )}
                {mode === MODE.REGISTER || mode === MODE.LOGIN ? (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="password"
                            className="ring-2 ring-gray-300 rounded-md p-4" />
                    </div>
                ) : null}
                {mode === MODE.LOGIN && (
                    <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.RESET_PASSWORD)}>Forgot your password? Reset.</div>
                )}
                <button disabled={isLoading}
                    className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
                    onClick={handleButton}
                >
                    {isLoading ? "Loading..." : buttonTitle}
                </button>
                {error && <div className="text-red-600 ">{error}</div>}
                {mode === MODE.LOGIN && (
                    <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.REGISTER)}>{"Don't"} have an account? Register.</div>
                )}
                {mode === MODE.REGISTER && (
                    <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.LOGIN)}>Have an account? Login.</div>
                )}
                {mode === MODE.RESET_PASSWORD && (
                    <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.LOGIN)}>Go back to login.</div>
                )}
                {message && <div className="text-green-600 text-sm">{message}</div>}
            </form>
        </div>
    )
}
export default LoginPage
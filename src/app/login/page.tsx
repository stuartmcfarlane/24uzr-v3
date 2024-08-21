"use client"

import { UserContext } from "@/context/UserContext"
import { ReactEventHandler, useContext, useState } from "react"
import { UserContextType } from '../../types/user';
import { useRouter } from "next/navigation";

enum MODE {
    LOGIN="LOGIN",
    REGISTER="REGISTER",
    RESET_PASSWORD="RESET_PASSWORD",
    EMAIL_VERIFICATION="EMAIL_VERIFICATION",
}
const LoginPage = () => {

    const router = useRouter()

    const [mode, setMode] = useState(MODE.LOGIN)
    const [username, setUsername]  = useState("")
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

    const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log('click', mode)
        switch (mode) {
            case MODE.LOGIN:
                console.log(`LOGIN`)
                setUser({
                    email: "stuart@mcfarlane.nl",
                    fistName: "Stuart",
                    lastName: "McFarlane",
                })
                break
            case MODE.REGISTER:
                console.log(`REGISTER`)
                break
            case MODE.RESET_PASSWORD:
                console.log(`RESET_PASSWORD`)
                break
            case MODE.EMAIL_VERIFICATION:
                console.log(`EMAIL_VERIFICATION`)
                break
            default:
        }
    }
    if (user) {
        router.push("/")
    }
    return (
        <div className="h-[calc(100vh-5rem)] px-4 md:px-8 lg:px16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form className="flex flex-col gap-8">
                <h1 className="text-2xl font-semibold">{formTitle}</h1>
                {mode === MODE.REGISTER ? (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="john"
                            autoComplete="username"
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
                            placeholder="Enter your ppassword"
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
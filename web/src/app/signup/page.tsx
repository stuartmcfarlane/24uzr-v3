import { redirect } from "next/navigation";
import { register } from "../../services/api"
import Link from "next/link";

const LoginPage = () => {

    const registerAction = async (formData: FormData) => {
        "use server"

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const name = formData.get('name') as string
    
        if (!email || !password) {
            return
        }

        const success = await fetch(`${process.env.ROOT_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        })
        if (success.ok) {
            redirect('/login')
        }
    }
    return (
        <div className="h-[calc(100vh-5rem)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
            <form action={registerAction}  className="flex flex-col gap-8">
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
                <Link href="/login"
                    className="text-sm underline cursor-pointer"
                >
                    Have an account? Login.
                </Link>
            </form>
        </div>
    )
}
export default LoginPage
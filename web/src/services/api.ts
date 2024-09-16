import { IUser } from "@/types/user"

export const login = async ({
    email,
    password
}: {
    email: string,
    password: string
    }
): Promise<boolean> => {
    console.log(`>login ${process.env.NEXT_PUBLIC_API_URL}`, process.env)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    })
    
    return response.ok
}

export const getUser = async (): Promise<IUser> => {
    console.log(`>getUser`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: 'GET',
        credentials: "include",
    })
    
    if (!response.ok) throw Error("Not logged in")
    
    const user = await response.json()
    return user
}
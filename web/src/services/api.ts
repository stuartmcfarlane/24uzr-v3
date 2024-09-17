import { IUser } from "@/types/user"

export const login = async ({
    email,
    password
}: {
    email: string,
    password: string
    }
): Promise<boolean> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    })
    
    return response.ok
}

export const getUser = async (): Promise<IUser> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: 'GET',
        credentials: "include",
    })
    
    if (!response.ok) throw Error("Not logged in")
    
    const user = await response.json()
    return user
}
"use client"

import { UserContext } from "@/context/UserContext"
import { UserContextType } from "@/types/user"
import { useRouter } from "next/navigation"
import { useContext } from "react"

const ProfilePage = () => {
    const router = useRouter()
    const { user } = useContext(UserContext) as UserContextType
    if (!user) {
        router.push("/login")
    }
    return (
        <div className="">
            <div className="">{user?.fistName} {user?.lastName}</div>
        </div>
    )
}
export default ProfilePage
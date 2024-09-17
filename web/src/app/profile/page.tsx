"use client"

import { UserContext } from "@/context/UserContext"
import { UserContextType } from "@/types/user"
import { useRouter } from "next/navigation"
import { useContext } from "react"

const ProfilePage = () => {
    console.log(`profile`)
    const router = useRouter()
    const { user } = useContext(UserContext) as UserContextType
    if (!user) {
        router.push("/login")
    }
    return (
        <>
            <h1 className="text-center md:text-left text-2xl">Profile</h1>
            <div className="py-4">
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                    <div className="">Name</div>
                    <div className="">{user?.name}</div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                    <div className="">Email</div>
                    <div className="">{user?.email}</div>
                </div>
            </div>
        </>
    )
}
export default ProfilePage
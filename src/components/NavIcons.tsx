"use client"

import { UserContext } from "@/context/UserContext"
import { UserContextType } from "@/types/user"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"

const NavIcons = () => {

    const router = useRouter()

    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const { user, logout } = useContext(UserContext) as UserContextType;

    const handleProfile = () => {
        if (!user) {
            router.push("/login")
            return
        }
        setIsProfileOpen(prev => !prev)
    }
    const handleLogout = () => {
        logout()
        setIsProfileOpen(prev => !prev)
        router.push("/")
    }

    return (
        <div className="flex items-center gap-4 xl:gap-6 relative">
            <Image src="/profile.png" alt="" width={22} height={22} className="cursor-pointer" onClick={handleProfile} />
            {isProfileOpen && (
                <div className="absolute p-4 rounded-md top-12 right-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10">
                    <Link href="/profile">Profile</Link>
                    <div
                        className="mt-2 cursor-pointer"
                        onClick={handleLogout}
                    >Logout</div>
                </div>
            )}
        </div>
    )
}
export default NavIcons
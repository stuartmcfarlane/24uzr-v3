"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const NavIcons = () => {

    const router = useRouter()

    const [isProfileOpen, setIsProfileOpen] = useState(false)

    // PLACEHOLDER FOR REAL LOGIN STATE
    const isLoggedIn = false

    const handleProfile = () => {
        if (!isLoggedIn) {
            router.push("/login")
            return
        }
        setIsProfileOpen(prev => !prev)
    }

    return (
        <div className="flex items-center gap-4 xl:gap-6 relative">
            <Image src="/profile.png" alt="" width={22} height={22} className="cursor-pointer" onClick={handleProfile} />
            {isProfileOpen && (
                <div className="absolute p-4 rounded-md top-12 right-0 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-10">
                    <Link href="profile">Profile</Link>
                    <div className="mt-2 cursor-pointer">Logout</div>
                </div>
            )}
        </div>
    )
}
export default NavIcons
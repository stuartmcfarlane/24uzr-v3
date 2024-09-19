import Link from "next/link"
import LogoutForm from "./LogoutForm"
import { getSession } from "@/actions/session"

const NavUser = async () => {

    const session = await getSession()

    return (
        <nav className="flex items-center gap-4 xl:gap-6 relative">
            {!session.isLoggedIn && <Link href="/login">Login</Link>}
            {session.isLoggedIn && <>
                <Link href="/profile">Profile</Link>
                <LogoutForm />
            </>}
        </nav>
    )
}
export default NavUser
import { getSession } from "@/actions/session"
import Link from "next/link"

const NavMenu = async () => {

    const session = await getSession()
    if (!session.isLoggedIn) {
        return <></>
    }
    if (session.isAdmin) return (
        <>
            <Link href="/dashboard">Dashboard</Link>
        </>
    )
    return (
        <>
            <Link href="/race">Race planner</Link>
        </>
    )
}
export default NavMenu
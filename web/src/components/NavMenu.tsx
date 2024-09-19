import { getSession } from "@/actions/session"
import Link from "next/link"

const NavMenu = async () => {

    const session = await getSession()
    if (!session.isLoggedIn) {
        return <></>
    }
    return (
        <>
            <Link href="/dashboard">Dashboard</Link>
        </>
    )
}
export default NavMenu
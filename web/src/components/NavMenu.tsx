import { getSession } from "@/actions/user"
import Link from "next/link"

const NavMenu = async () => {

    const session = await getSession()
    if (!session.isLoggedIn) {
        return <></>
    }
    return (
        <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/maps">Maps</Link>
        </>
    )
}
export default NavMenu
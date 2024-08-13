import Link from "next/link"
import Menu from "./Menu"
import SearchBar from "./SearchBar"
import NavIcons from "./NavIcons"

const Navbar = () => {
    return (
        <div className="h-20 px-4 md:px-8 lg:px16 xl:px-32 2xl:px-64 relative">
            {/* MOBILE */}
            <div className="h-full flex md:hidden items-center justify-between">
                <Link href="/">
                    <div className="text-2xl tracking-wide">
                        24uzr
                    </div>
                </Link>
                <Menu/>
            </div>
            {/* BIGGER SCREENS */}
            <div className="hidden md:flex items-center justify-between gap-8 h-full">
                {/* LEFT */}
                <div className="w-1/3">
                    <Link href="/">
                        <div className="text-2xl tracking-wide">
                            24uzr
                        </div>
                    </Link>
                </div>
                {/* RIGHT */}
                <div className="w-3/2 flex items-center justify-between gap-8">
                    <SearchBar/>
                    <NavIcons/>
                </div>
            </div>
        </div>
    )
}
export default Navbar
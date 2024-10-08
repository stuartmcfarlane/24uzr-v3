"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

const SearchBar = () => {

    const router = useRouter()

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const query = formData.get("query") as string
        if (query) {
            router.push(`/search?query=${query}`)
        }

    }
    return (
        <form className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md" onSubmit={handleSearch}>
            <input type="text" name="query" placeholder="Search" className="flex-1 bg-transparent outline-none"/>
            <button className="cursor-pointer">
                <Image src="/search.png" alt="" width={16} height={16} />
            </button>
        </form>
    )
}
export default SearchBar
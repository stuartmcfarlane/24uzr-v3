"use client"

import { createMap } from "@/actions/map"
import { useRouter } from "next/navigation"

export const NewMapTool = () => {
    
    const router = useRouter()
    
    return (
        <div>
            <form action={createMap}>
                <input
                    type="text"
                    name="name"
                    placeholder="map name"
                    className="ring-2 ring-gray-300 rounded-md p-4" />
                <button className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
                    type="submit"
                >
                    create
                </button>
            </form>
        </div>
    )
}
"use client"

import { createtMap } from "@/services/api"
import { useRouter } from "next/navigation"
import { FormEvent } from "react"

export const NewMapTool = () => {
    
    const router = useRouter()
    
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        console.log(`>onSubmit`)
        event.preventDefault()
        
        const formData = new FormData(event.currentTarget)
        const name = formData.get('name') as string

        const map = await createtMap({name})
        
        router.push(`/map/${map.id}`)
    }
    
    return (
        <div>
            <form onSubmit={onSubmit}>
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
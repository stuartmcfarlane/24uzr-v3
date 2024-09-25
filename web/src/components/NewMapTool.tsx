"use client"

import { createMapWithForm } from "@/actions/map"

export const NewMapTool = () => {
    
    return (
        <div>
            <form action={createMapWithForm}>
                <input
                    type="text"
                    name="name"
                    placeholder="map name"
                    className="ring-2 ring-gray-300 rounded-md p-4 w-full my-2"/>
                <button className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed my-2"
                    type="submit"
                >
                    create
                </button>
            </form>
        </div>
    )
}
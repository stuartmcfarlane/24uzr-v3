"use server"

import { getSession } from "@/actions/session"
import Link from "next/link"


export const WindTool = async () => {

    const session = await getSession()
    return (
        <div className="bg-slate-50 p-5">
            <h2 className="text-xl border-b-2 pb-2">Wind</h2>
                <Link href="/wind">
                <button
                    className="w-full bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed my-2"
                >
                    Upload new GRIB file
                </button>
                </Link>
        </div>
    )
}
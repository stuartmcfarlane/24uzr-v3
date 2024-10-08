import { getSession } from "@/actions/session"
import MapCanvas from "@/components/ MapCanvas"
import WindOptions from "@/components/WindOptions"
import { redirect } from "next/navigation"

const WindPage = async () => {

    const session = await getSession()
    if (!session.isAdmin) {
        redirect('/')
    }
    return (
        <div className="flex-grow my-8 flex gap-4">
            <div className="flex flex-col">
                <div className="flex-1 flex flex-col">
                    <h1 className="text-lg flex gap-4">
                        Wind
                    </h1>
                    <div className="flex-1 flex flex-col gap-4 mt-4 border-t-2 pt-4">
                        <WindOptions />
                    </div>
                </div>
            </div>
            <div className="border flex-grow flex flex-col">
                <div className="flex-1">
                    <MapCanvas />
                </div>
            </div>
        </div>
    )
}

export default WindPage
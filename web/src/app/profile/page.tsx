
import { getSession } from "@/actions"
import { redirect } from "next/navigation"

const ProfilePage = async () => {

    const session = await getSession()

    if (!session.isLoggedIn) {
        redirect('/')
    }
    return (
        <>
            <h1 className="text-center md:text-left text-2xl">Profile</h1>
            <div className="py-4">
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                    <div className="">Name</div>
                    <div className="">{session?.name}</div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                    <div className="">Email</div>
                    <div className="">{session?.email}</div>
                </div>
                {session.isAdmin && (
                    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                        <div className=""></div>
                        <div className="">Admin user</div>
                    </div>
                )}
            </div>
        </>
    )
}
export default ProfilePage
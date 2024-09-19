
import { IApiUserOutput } from '../types/api';

type UserDetailsProps = {
    user: IApiUserOutput | null
}

const UserDetails = async ({
    user
}: UserDetailsProps) => {
    return (
        <div className="py-4">
            <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                <div className="">Name</div>
                <div className="">{user?.name}</div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                <div className="">Email</div>
                <div className="">{user?.email}</div>
            </div>
            {user?.isAdmin && (
                <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 flex justify-between gap-24">
                    <div className=""></div>
                    <div className="">Admin user</div>
                </div>
            )}
        </div>
    )
}

export default UserDetails
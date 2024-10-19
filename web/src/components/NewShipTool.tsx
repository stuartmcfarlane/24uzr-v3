import { createShipWithForm } from "@/actions/ship"
import {  IApiUserOutput } from "@/types/api"

export type NewShipToolProps = {
    users: IApiUserOutput[]
}
export const NewShipTool = (props: NewShipToolProps) => {
    const { users } = props
    return (
        <div>
            <form action={createShipWithForm}>
                <input
                    type="text"
                    name="name"
                    placeholder="Ship name"
                    className="ring-2 ring-gray-300 rounded-md p-4 w-full my-2"
                />
                <label
                    htmlFor="owner"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Select the owner
                </label>
                <select
                    multiple
                    id="owner"
                    name="ownerId"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                <button
                    className="w-full bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed my-2"
                    type="submit"
                >
                    create
                </button>
            </form>
        </div>
    )
}
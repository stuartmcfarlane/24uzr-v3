import { uploadWindJson } from "@/actions/wind"
import { IApiWindOutput } from "@/types/api"

type WindOptionsProps = {
    wind?: IApiWindOutput
}
const WindOptions = (props: WindOptionsProps) => {
    const {
        wind,
    } = props

    console.log(`WindOptions`)
    return (
        <form action={uploadWindJson}  className="flex flex-col gap-4 flex-grow">
            <button
                type="submit"
                className="bg-24uzr text-white p-2 rounded-md disabled:bg-24uzr-disabled disabled:cursor-not-allowed"
            >
                Import data
            </button>
            <label>
                <span>Upload a file</span>
                <input
                    type="file"
                    name="file"
                    className="ring-2 ring-gray-300 rounded-md p-4 h-full min-h-full"
                />
            </label>
        </form>
    )
}

export default WindOptions
import { ReactNode } from "react"

export const ContentSection = ({children}: {children: ReactNode}) => {
    return (
        <div className="min-h-[calc(100vh-5rem-2rem)] md:min-h-[calc(100vh-5rem-2rem)] flex flex-col">
            <div className="flex-grow px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative border-t-2 flex flex-col">
                {children}
            </div>
        </div>
    )
}
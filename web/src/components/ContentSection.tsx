import { ReactNode } from "react"

export const ContentSection = ({children}: {children: ReactNode}) => {
    return (
        <div className="min-h-[calc(100vh-5rem-10rem)] md:min-h-[calc(100vh-5rem-4rem)]">
            <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative border-t-2">
                {children}
            </div>
        </div>
    )
}
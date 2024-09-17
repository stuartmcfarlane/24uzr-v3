import { ReactNode } from "react"

export const ContentSection = ({children}: {children: ReactNode}) => {
    return (
        <div className="min-h-[calc(100vh-5rem-22rem)] md:min-h-[calc(100vh-5rem-16rem)]">
            <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
                {children}
            </div>
        </div>
    )
}
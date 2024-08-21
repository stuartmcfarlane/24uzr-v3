import { ReactNode } from "react"

export const ContentSection = ({children}: {children: ReactNode}) => {
    return (
        <div className="min-h-[calc(100vh-5rem-22rem)] md:min-h-[calc(100vh-5rem-16rem)]">
            {children}
        </div>
    )
}
import React from "react"
import { Children } from "react"

export default function MarketingLayout({ children }: {
    children: React.ReactNode
}) {

    return (
        <div>
            <main>
                {children}
            </main>
        </div>
    )
}
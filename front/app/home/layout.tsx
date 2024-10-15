import HomeHeader from "@/components/homeHeader"
import React from "react"
import { Children } from "react"

export default function homeLayout({ children }: {
    children: React.ReactNode
}) {

    return (
        <div>
            <HomeHeader />
            <main>
                {children}
            </main>
        </div>
    )
}
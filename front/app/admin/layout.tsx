import HomeHeader from "@/components/homeHeader"
import React from "react"
import { Children } from "react"
import { AuthProvider, useAuth } from "@/Providers/AuthProvider"

export default function AdminLayout({ children }: {
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
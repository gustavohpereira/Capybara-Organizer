"use client"

import LoginComponent from "@/components/LoginComponent"
import Image from "next/image"

export default function MarketingPage() {


    return (
        <div className="flex min-h-screen bg-gradient-to-r from-teal-400 to-cyan-500">
            {/* left side */}
            <div className="h-screen w-1/2 flex flex-col items-center justify-center p-16 gap-12 bg-opacity-90">
                <Image src={'/capybara_login.png'} width={250} height={250} alt="logo da capybara organizer" className="drop-shadow-lg" />
                <h1 className="font-normal text-6xl text-center text-white drop-shadow-md">
                    Um novo jeito de se <strong className="font-extrabold">organizar</strong>
                </h1>
                <p className="text-center text-white text-lg">
                    Transforme sua rotina com organização e praticidade
                </p>
            </div>
            {/* right side */}
            <LoginComponent />
        </div>
    )
}
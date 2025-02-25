"use client"
import LoginForm from "@/components/forms/loginForm"
import RegisterForm from "@/components/forms/registerForm"
import Image from "next/image"
import { useState } from "react"


export default function MarketingPage() {
    const [formMode, setFormMode] = useState('login')
    

    return (
        <div className="flex">
            {/* left side */}
            <div className="bg-teal-500 h-screen w-1/2 flex flex-col items-center justify-center p-16 gap-12">
                <Image src={'/capybara_login.png'} width={250} height={250} alt="logo da capybara organizer"></Image>
                <h1 className="font-normal text-6xl text-center text-white">
                    Um novo jeito de se <strong className="font-extrabold">organizar</strong>
                </h1>
                <p className="text-center text-white ">
                Transforme sua rotina com organização e praticidade
                </p>
            </div>
            {/* right side */}

            <div className="flex flex-col justify-center items-center w-1/2">
                <div className="w-1/2  rounded flex flex-col justify-center items-center  p-8  ">
                    <div>

                        <button className={`${formMode === 'login' ? 'border-b-black border-b ' : 'text-black'} p-2`} onClick={() => setFormMode('login')}>
                            Login
                        </button>
                        <button className={`${formMode === 'register' ? 'border-b-black border-b ' : 'text-black'} p-2`} onClick={() => setFormMode('register')}>
                            Cadastrar
                        </button>

                    </div>
                        {formMode === 'login' ? <LoginForm /> : <RegisterForm />}
                </div>
            </div>
        </div>
    )
}
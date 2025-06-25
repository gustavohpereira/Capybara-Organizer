"use client"

import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import LoginForm from "@/components/forms/loginForm"
import RegisterForm from "@/components/forms/registerForm"

export default function LoginComponent() {
    const [formMode, setFormMode] = useState<'login' | 'register'>('login')
    const [loading, setLoading] = useState(false)

    return (
        <div className="flex flex-col justify-center items-center w-1/2 bg-white bg-opacity-80 relative">
            <div className="w-full max-w-md rounded-2xl shadow-2xl flex flex-col justify-center items-center transition-all duration-300 bg-white relative">
                <div className="flex w-full mb-8">
                    <button
                        className={`flex-1 py-2 text-lg font-semibold rounded-tl-2xl transition-all duration-200 ${formMode === 'login'
                            ? 'bg-teal-500 text-white shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        onClick={() => setFormMode('login')}
                        disabled={loading}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-2 text-lg font-semibold rounded-tr-2xl transition-all duration-200 ${formMode === 'register'
                            ? 'bg-teal-500 text-white shadow'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        onClick={() => setFormMode('register')}
                        disabled={loading}
                    >
                        Cadastrar
                    </button>
                </div>
                <div className="w-full transition-all duration-300">
                    <AnimatePresence mode="wait" initial={false}>
                        {formMode === 'login' ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoginForm  setLoading={setLoading} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RegisterForm  setLoading={setLoading} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-2xl">
                        <svg className="animate-spin h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    )
}
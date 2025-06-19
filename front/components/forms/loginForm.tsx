import { login } from '@/functions/authFunctions';
import { useAuth } from '@/Providers/AuthProvider';

import React from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';




export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();  // Usando o login do contexto de autenticação

    async function onSubmit({ email, password }: any) {
        const token = await login({ email, password });
        if (token) {
            window.location.replace('/home');
            notify_toasted('Login feito com sucesso!','success');
        } else {
            notify_toasted('Login falhou, tente novamente.','error');
        }

    }

    function notify_toasted(message: String,mode:String = 'default') {
    
        switch (mode) {
            case 'success':
            toast.success(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            break;
            case 'warning':
            toast.warning(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            break;
            case 'error':
            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            break;
            default:
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }


    return (
        <div className="flex justify-center items-center ">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-14 rounded-lg shadow-2xl w-full ">


                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        id='email'
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('email', { required: 'Email é obrigatório' })}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message?.toString()}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register('password', { required: 'Senha é obrigatória' })}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message?.toString()}</p>}
                </div>

                <button type="submit" className="w-full bg-teal-500 text-white p-3 rounded-md hover:bg-blue-600">
                    Login
                </button>
            </form>

            <ToastContainer />
        </div>
    );
}

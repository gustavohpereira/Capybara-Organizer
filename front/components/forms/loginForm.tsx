import { login } from '@/functions/authFunctions';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    function onSubmit(data: any) {
        console.log("data",data)
        login(data);
    }

    return (
        <div className="flex justify-center items-center ">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-14 rounded-lg shadow-2xl w-full ">


                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
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

                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    );
}

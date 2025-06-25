"use client"

import { useRouter } from "next/navigation"
import { IoMdClose } from "react-icons/io";
import Cookies from "js-cookie";
export default function BoardCard({ title, numberOfTasks, numberOfMembers, id }: { title: string, numberOfTasks: number, numberOfMembers: number, id: number }) {
    const router = useRouter();

    const handleDeleteBoard = async () => {

        try {
            const isConfirmed = window.confirm('Tem certeza que deseja remover esta tarefa?');
            if (isConfirmed) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/board/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    }
                });
                console.log(response);
                if (response.ok) {
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    }

    return (
        <div
            onClick={() => router.push(`/boards/${id}`)}
            className="group w-full sm:w-1/2 lg:w-1/4 min-w-[260px] border-l-4 border-emerald-400 bg-white rounded-md shadow-xl hover:shadow-md hover:border-emerald-500 transition-all duration-200 cursor-pointer focus:outline-none px-5 py-4"
            tabIndex={0}
            aria-label={`Abrir quadro ${title}`}
            onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    router.push(`/boards/${id}`);
                }
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-lg font-semibold text-gray-800 line-clamp-2 pr-2">{title}</h1>
                <button
                    className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors duration-200 opacity-60 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remover quadro"
                    onClick={e => {
                        e.stopPropagation();
                        handleDeleteBoard();
                    }}
                    tabIndex={0}
                >
                    <IoMdClose size={18} />
                </button>
            </div>

            <div className="flex gap-6">
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-emerald-600">{numberOfTasks}</span>
                    <span className="text-sm text-gray-500">Tarefas</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-sky-600">{numberOfMembers}</span>
                    <span className="text-sm text-gray-500">Membros</span>
                </div>
            </div>
        </div>
    )
}
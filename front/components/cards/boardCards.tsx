"use client"

import { useRouter } from "next/navigation"
import { IoMdClose } from "react-icons/io";
import Cookies from "js-cookie";
export default function BoardCard({ title, numberOfTasks, id }: { title: string, numberOfTasks: number, id: number }) {
    const router = useRouter();

    const handleDeleteBoard = async () => {

        try {
            const isConfirmed = window.confirm('Tem certeza que deseja remover esta tarefa?');
            if (isConfirmed){
                const response = await fetch(`http://localhost:8080/board/${id}`, {
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
            onClick={() => {
                router.push(`/boards/${id}`);
            }}
            className="border-2 hover:border-teal-200 p-4 w-1/5 shadow-lg rounded-lg hover:cursor-pointer duration-300 m-1 "
        >
            <div className="flex justify-between">
                <h1 className="font-bold text-xl">{title}</h1>
                <button
                    className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded-full duration-300"
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que o clique no botão de deletar redirecione
                        handleDeleteBoard();
                    }}
                >
                    <IoMdClose size={20} />
                </button>
            </div>

            <div className="mt-4">
                <h2>Numero de tarefas: {numberOfTasks}</h2>
            </div>
        </div>
    )
}
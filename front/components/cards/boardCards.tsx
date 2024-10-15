"use client"

import { useRouter } from "next/navigation"
export default function BoardCard({ title, numberOfTasks, id }: { title: string, numberOfTasks: number, id: number }) {
    const router = useRouter();
    return (
        <div onClick={() => {
            router.push(`/boards/${id}`);
        }} 
        className="border-2 p-4 w-1/5 shadow-xl rounded-md hover:cursor-pointer hover:shadow-2xl">
            <h1 className="font-bold text-xl">{title}</h1>
            <div className="mt-4">
                <h2>numero de tarefas:{numberOfTasks}</h2>
            </div>
        </div>
    )
}
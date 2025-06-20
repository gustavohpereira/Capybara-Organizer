import { useEffect, useState } from "react";
import { FaListAlt, FaClipboardList, FaSpinner, FaCheckCircle } from "react-icons/fa";

interface Stats {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}

interface TaskStatisticCardsProps {
    userId: string;
}

export default function TaskStatisticCards({ userId }: TaskStatisticCardsProps) {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/statistics/getTaskGlobalNumbers/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                const stats: Stats = {
                    total: 0,
                    todo: 0,
                    inProgress: 0,
                    done: 0,
                };
                data.forEach((item: { state: string; count: number }) => {
                    if (item.state === "total") stats.total = item.count;
                    else if (item.state === "todo") stats.todo = item.count;
                    else if (item.state === "doing" || item.state === "inProgress") stats.inProgress = item.count;
                    else if (item.state === "done") stats.done = item.count;
                });
                setStats(stats);
            })
            .catch(() => setStats(null));
    }, [userId]);

    const cardData = [
        {
            key: "total",
            title: "Todas as tarefas",
            icon: <FaListAlt className="text-blue-500 text-3xl" />,
            bg: "bg-blue-50",
            border: "border-blue-200",
        },
        {
            key: "todo",
            title: "A fazer",
            icon: <FaClipboardList className="text-yellow-500 text-3xl" />,
            bg: "bg-yellow-50",
            border: "border-yellow-200",
        },
        {
            key: "inProgress",
            title: "Em progresso",
            icon: <FaSpinner className="text-purple-500 text-3xl animate-spin-slow" />,
            bg: "bg-purple-50",
            border: "border-purple-200",
        },
        {
            key: "done",
            title: "Concluídas",
            icon: <FaCheckCircle className="text-green-500 text-3xl" />,
            bg: "bg-green-50",
            border: "border-green-200",
        },
    ] as const;

    return (
        <div className="w-full">

            <div className="flex gap-4 w-full">
                {cardData.map((card) => (
                    <div
                        key={card.key}
                        className={`${card.bg} ${card.border} border rounded-xl shadow-md p-6 w-full sm:w-1/2 lg:w-1/4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg`}
                    >
                        <div className="mb-2">{card.icon}</div>
                        <div className="text-md font-medium text-gray-700">{card.title}</div>
                        <div className="text-3xl font-bold mt-1 text-gray-900">
                            {stats ? stats[card.key as keyof Stats] : "..."}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

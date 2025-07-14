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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/getTaskGlobalNumbers/${userId}`)
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
            icon: <FaListAlt className="text-teal-500 text-2xl" />,
            bar: "bg-teal-400",
        },
        {
            key: "todo",
            title: "A fazer",
            icon: <FaClipboardList className="text-orange-500 text-2xl" />,
            bar: "bg-orange-400",
        },
        {
            key: "inProgress",
            title: "Em progresso",
            icon: <FaSpinner className="text-indigo-500 text-2xl animate-spin-slow" />,
            bar: "bg-indigo-400",
        },
        {
            key: "done",
            title: "Concluídas",
            icon: <FaCheckCircle className="text-emerald-500 text-2xl" />,
            bar: "bg-emerald-400",
        },
    ] as const;

    return (
        <div className="w-full flex gap-4 flex-wrap">
            {cardData.map((card) => (
                <div
                    key={card.key}
                    className="group flex-1 basis-0 min-w-[200px] bg-white rounded-lg shadow-md hover:shadow-xl border border-transparent hover:border-teal-400 transition-all duration-200 cursor-pointer focus:outline-none"
                    tabIndex={0}
                    aria-label={card.title}
                >
                    <div className={`${card.bar} rounded-t-lg h-2 w-full`} />
                    <div className="flex flex-col items-center p-6">
                        <div className="mb-2">{card.icon}</div>
                        <div className="text-lg font-semibold text-gray-800">{card.title}</div>
                        <div className="text-3xl font-bold mt-1 text-gray-900">
                            {stats ? stats[card.key as keyof Stats] : "..."}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}

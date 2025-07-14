"use client";
import UserCard from "@/components/cards/userCard";
import { useAuth } from "@/Providers/AuthProvider";
import { useUser } from "@/Providers/UserProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const { auth } = useAuth();
    const { user } = useUser();
    const router = useRouter();


    useEffect(() => {
        async function load() {
            try {
                getUsersData();
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar usuários.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    useEffect(() => {
        checkIfAdmin();
    }, [user]);

    async function checkIfAdmin() {
        const user = await auth();

        if (!user) {
            setError("Usuário não autenticado.");
            router.push("/home");
            return;
        }
        if (user.role !== "admin") {
            router.push("/home");
            return;
        }
    }

    async function getUsersData() {
        const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/`);
        if (usersResponse) {
            setUsers(usersResponse.data);
        }
    }



    return (
        <div className="p-8">
            {!loading && (
                <>
                    <div className="my-8 ">
                        <h1 className="font-semibold text-3xl">Tela de administração</h1>
                    </div>
                    <div className="flex gap-8 w-[80%] flex-wrap">
                        {users.map((user, index) => (
                            <UserCard key={index} user={user} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )

}
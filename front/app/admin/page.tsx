"use client";
import UserCard from "@/components/cards/userCard";
import { useAuth } from "@/Providers/AuthProvider";
import { useUser } from "@/Providers/UserProvider";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminPage() {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const { auth } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        async function verifyUser() {
            const userData = await auth();
            if (userData) {
                setLoading(false);
            }
        }

        async function getUsersData() {
            const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/`);
            if (usersResponse) {
                setUsers(usersResponse.data);
            }
        }
        getUsersData();
        verifyUser();
    }, []);




    if (loading) {
        return <div>Carregando...</div>;
    }

    if (user?.role != "admin") {
        window.location.href = "/";
    }

    return (
        <div className="p-8">
            <div className="my-8 ">
                <h1 className="font-semibold text-3xl">Tela de administração</h1>
            </div>
            <div className="flex gap-8 w-[80%] flex-wrap">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    )

}
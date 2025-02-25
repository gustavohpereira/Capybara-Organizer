"use client";

import Image from "next/image";
import capImage from '../images/capybara.png';
import { useEffect, useState } from "react";
import axios from "axios";
import BoardCard from "./cards/boardCards";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { useUser } from "@/Providers/UserProvider";
export default function HomeHeader() {

    const { user } = useUser();

    const handleLogout = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const confirm = window.confirm("Tem certeza que deseja sair?");
        if (confirm) {
            Cookies.remove('token');
            window.location.href = '/';
        }
    }
    
    return (
        <div className="w-full flex sticky top-0 bg-teal-500 justify-between border-b-2 p-4 items-center">
            <div className=" flex justify-start items-center">

                <Link href={"/home"} className="text-xl font-bold">
                    <Image src={capImage} alt="logo" width={50} height={50} className="mr-12" priority></Image>
                </Link>
                <div className=" gap-6 flex">

                    <Link href={"/home"} className="text-xl font-bold text-white">Home</Link>
                    {user?.role === "admin" && <Link href={"/admin"} className="text-xl font-bold text-white">Admin</Link>}
                </div>
            </div>
            <div>
                <button onClick={handleLogout} className="text-xl font-bold ">
                    <IoLogOutOutline className="text-red-400 hover:text-red-600 " size={35} />
                </button>
            </div>
        </div>
    )
}
"use client";

import Image from "next/image";
import capImage from '../images/capybara.png';
import { useEffect, useState } from "react";
import axios from "axios";
import BoardCard from "./cards/boardCards";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import Cookies from "js-cookie";
export default function HomeHeader() {

    const handleLogout = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        Cookies.remove('token');
        window.location.href = '/';
    }

    return (
        <div className="w-full flex justify-between border-b-2 border-gray-300 p-4 items-center">
            <div className=" flex justify-start items-center">

                <Link href={"/home"} className="text-xl font-bold">
                    <Image src={capImage} alt="logo" width={50} height={50} className="mr-12" priority></Image>
                </Link>
                <Link href={"/home"} className="text-xl font-bold hover:text-teal-500">Home</Link>
            </div>
            <div>
                <button onClick={handleLogout} className="text-xl font-bold ">
                    <IoLogOutOutline className="text-red-400 hover:text-red-600 " size={35} />
                </button>
            </div>
        </div>
    )
}
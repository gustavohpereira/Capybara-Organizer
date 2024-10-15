"use client";

import Image from "next/image";
import capImage from '../images/capybara.png';
import { useEffect, useState } from "react";
import axios from "axios";
import BoardCard from "./cards/boardCards";
import Link from "next/link";
export default function HomeHeader() {

    return (
        <div className="w-full flex justify-start border-b-2 border-gray-300 p-4 items-center">
            <Link href={"/home"} className="text-xl font-bold">
                <Image src={capImage} alt="logo" width={50} height={50} className="mr-12" priority></Image>
            </Link>
            <Link href={"/home"} className="text-xl font-bold">Home</Link>
        </div>
    )
}
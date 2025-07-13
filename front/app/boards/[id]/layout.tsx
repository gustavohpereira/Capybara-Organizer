import HomeHeader from "@/components/homeHeader";
import { ReactNode } from "react";

export default function BoardLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <HomeHeader />
            {children}
        </>
    );
}
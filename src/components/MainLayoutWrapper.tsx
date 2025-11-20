"use client";

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <>
            <Navbar />
            <div className={isAdmin ? "" : "mx-auto max-w-6xl px-4 py-6"}>
                {children}
            </div>
        </>
    );
}

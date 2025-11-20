"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    if (pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link href="/" className="text-xl font-bold text-primary">
                    TableBooking
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/book"
                        className={clsx(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive("/book") ? "text-primary" : "text-slate-600"
                        )}
                    >
                        Book a Table
                    </Link>
                    <Link
                        href="/manage-booking"
                        className={clsx(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive("/manage-booking") ? "text-primary" : "text-slate-600"
                        )}
                    >
                        Manage Booking
                    </Link>
                    <div className="h-4 w-px bg-slate-200" />
                    <Link
                        href="/admin/login"
                        className={clsx(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname.startsWith("/admin") ? "text-primary" : "text-slate-600"
                        )}
                    >
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
}

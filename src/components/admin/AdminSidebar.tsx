"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path: string) => pathname === path;

    const links = [
        { href: "/admin", label: "Reservations", icon: "📅" },
        { href: "/admin/offline-booking", label: "Offline Booking", icon: "✍️" },
        { href: "/admin/setup", label: "Setup", icon: "⚙️" },
        { href: "/admin/availability", label: "Create Availability", icon: "➕" },
        { href: "/admin/manage-availability", label: "Manage Availability", icon: "📋" }
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
    };

    if (pathname === "/admin/login") {
        return null;
    }

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
            <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b border-slate-100 px-6">
                    <Link href="/admin" className="text-xl font-bold text-primary">
                        Admin Console
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href as any}
                            className={clsx(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive(link.href)
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <span className="text-lg">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-slate-100 p-3">
                    <div className="space-y-1">
                        <Link
                            href="/admin/profile"
                            className={clsx(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive("/admin/profile")
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <span className="text-lg">👤</span>
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                            <span className="text-lg">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

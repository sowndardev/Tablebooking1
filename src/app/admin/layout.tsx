"use client";

import AdminSidebar from "@/components/admin/AdminSidebarComponent";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className={clsx("transition-all", !isLoginPage && "pl-64")}>
        <main className={clsx(!isLoginPage && "p-8")}>{children}</main>
      </div>
    </div>
  );
}



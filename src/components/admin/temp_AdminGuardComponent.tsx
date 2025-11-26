"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("unauthorized");
      })
      .then(() => setAllowed(true))
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  if (!allowed) {
    return <p className="p-6 text-center text-slate-500">Checking access…</p>;
  }

  return <>{children}</>;
}


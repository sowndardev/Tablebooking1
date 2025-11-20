"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentActions({ bookingCode }: { bookingCode: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "processing">("idle");
  const [error, setError] = useState("");

  const handle = async (action: "success" | "failure") => {
    setStatus("processing");
    setError("");
    try {
      const res = await fetch(`/api/payments/${bookingCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error("Payment update failed");
      router.push(`/status/${bookingCode}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="mt-8 space-y-3">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={status === "processing"}
          onClick={() => handle("success")}
          className="rounded-full bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          Pay now
        </button>
        <button
          type="button"
          disabled={status === "processing"}
          onClick={() => handle("failure")}
          className="rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-600 disabled:opacity-50"
        >
          Fail payment
        </button>
      </div>
    </div>
  );
}


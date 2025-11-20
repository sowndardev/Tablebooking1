"use client";

import { useState } from "react";

export default function ManageBookingPage() {
  const [form, setForm] = useState({ bookingCode: "", phone: "" });
  const [reservation, setReservation] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true);
    setError("");
    setReservation(null);
    try {
      const response = await fetch("/api/public/manage/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Invalid details");
      setReservation(await response.json());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!reservation) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/public/manage/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Unable to cancel");
      setReservation({ ...reservation, status: "CANCELLED" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-primary">Manage your booking</h1>
        <p className="text-slate-600">Cancel or review your reservation using the booking code.</p>
      </header>
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Booking code</span>
            <input
              value={form.bookingCode}
              onChange={(e) => setForm({ ...form, bookingCode: e.target.value.toUpperCase() })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Phone number</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button
          onClick={lookup}
          disabled={loading}
          className="mt-4 rounded-full bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          Look up booking
        </button>

        {reservation && (
          <div className="mt-6 rounded-xl border border-slate-100 p-4">
            <p className="text-sm text-slate-500">Status: {reservation.status}</p>
            <p className="text-lg font-semibold">{reservation.location.name}</p>
            <p className="text-sm text-slate-500">
              {reservation.date?.slice(0, 10)} · {reservation.timeSlot}
            </p>
            {reservation.status !== "CANCELLED" && (
              <button
                onClick={cancel}
                disabled={loading}
                className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
              >
                Cancel reservation
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


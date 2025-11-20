"use client";

import { useEffect, useState } from "react";

type Location = { id: number; name: string };

export default function OfflineBookingForm() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    locationId: "",
    date: "",
    timeSlot: "",
    requestedPax: "",
    paymentStatus: "PAID"
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(() => setMessage("Unable to load locations"));
    setForm((current) => ({
      ...current,
      date: new Date().toISOString().slice(0, 10)
    }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/reservations/offline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        locationId: Number(form.locationId),
        requestedPax: Number(form.requestedPax)
      })
    });
    if (res.ok) {
      const data = await res.json();
      setMessage(`Offline booking confirmed: ${data.bookingCode}`);
    } else {
      setMessage("Failed to create offline booking");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-primary">Offline / walk-in booking</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          placeholder="Customer name"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        />
        <input
          placeholder="Phone number"
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        />
        <select
          value={form.locationId}
          onChange={(e) => setForm({ ...form, locationId: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        >
          <option value="">Location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        />
        <select
          value={form.timeSlot}
          onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        >
          <option value="">Select time slot</option>
          <option value="18:00-19:00">18:00-19:00</option>
          <option value="19:00-20:00">19:00-20:00</option>
          <option value="20:00-21:00">20:00-21:00</option>
        </select>
        <input
          type="number"
          placeholder="Party size"
          value={form.requestedPax}
          onChange={(e) => setForm({ ...form, requestedPax: e.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        />
      </div>
      <button className="rounded-full bg-primary px-5 py-3 font-semibold text-white">Save booking</button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}


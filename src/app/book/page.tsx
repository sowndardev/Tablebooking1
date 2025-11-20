"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Location = {
  id: number;
  name: string;
};

type TableType = {
  id: number;
  paxSize: number;
};

type Slot = {
  timeSlot: string;
  tableTypeId: number;
  paxSize: number;
};

export default function BookPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [locations, setLocations] = useState<Location[]>([]);
  const [paxOptions, setPaxOptions] = useState<TableType[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    locationId: "",
    date: "",
    requestedPax: "",
    timeSlot: ""
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const phone = params.get("phone");
    const name = params.get("name");
    setForm((current) => ({
      ...current,
      customerPhone: phone ?? current.customerPhone,
      customerName: name ?? current.customerName,
      date: current.date || new Date().toISOString().slice(0, 10)
    }));
  }, [params]);

  useEffect(() => {
    fetch("/api/public/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(() => setError("Unable to load locations"));
    fetch("/api/public/table-types")
      .then((res) => res.json())
      .then(setPaxOptions)
      .catch(() => setError("Unable to load PAX options"));
  }, []);

  useEffect(() => {
    if (!form.locationId || !form.date || !form.requestedPax) return;
    setLoadingSlots(true);
    setError("");
    fetch(
      `/api/public/availability?locationId=${form.locationId}&date=${form.date}&requestedPax=${form.requestedPax}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => {
        if (data.closed) {
          setSlots([]);
          setError(`Restaurant is closed: ${data.reason}`);
        } else {
          setSlots(data);
        }
      })
      .catch(() => {
        setSlots([]);
        setError("No tables available for the selected filters.");
      })
      .finally(() => setLoadingSlots(false));
  }, [form.locationId, form.date, form.requestedPax]);

  const handleChange = (key: string, value: string) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "locationId" || key === "date" || key === "requestedPax") {
        next.timeSlot = "";
        setSlots([]);
      }
      return next;
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locationId: Number(form.locationId),
          requestedPax: Number(form.requestedPax)
        })
      });
      if (!response.ok) {
        throw new Error("Failed to create reservation");
      }
      const data = await response.json();
      setSuccess("Reservation created. Redirecting to payment...");
      router.push(data.paymentUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Step 1 of 3</p>
        <h1 className="text-3xl font-semibold text-primary">Reserve a table</h1>
        <p className="text-slate-600">Pick a location, time slot, and share your contact details.</p>
      </header>
      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Name</span>
            <input
              value={form.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">WhatsApp number</span>
            <input
              value={form.customerPhone}
              onChange={(e) => handleChange("customerPhone", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Email (optional)</span>
            <input
              type="email"
              value={form.customerEmail}
              onChange={(e) => handleChange("customerEmail", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Location</span>
            <select
              value={form.locationId}
              onChange={(e) => handleChange("locationId", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="">Select</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Party size</span>
            <select
              value={form.requestedPax}
              onChange={(e) => handleChange("requestedPax", e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="">Select</option>
              {paxOptions.map((pax) => (
                <option key={pax.id} value={pax.paxSize}>
                  {pax.paxSize} guests
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600">Time slots</p>
          {loadingSlots && <p className="text-sm text-slate-500">Loading availability…</p>}
          {!loadingSlots && slots.length === 0 && (
            <p className="text-sm text-slate-500">Select filters to see slots.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.timeSlot}
                onClick={() => handleChange("timeSlot", slot.timeSlot)}
                className={`rounded-full border px-4 py-2 text-sm ${form.timeSlot === slot.timeSlot ? "border-primary bg-primary text-white" : "border-slate-200"
                  }`}
              >
                {slot.timeSlot} · upto {slot.paxSize}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <button
          disabled={submitting || !form.timeSlot}
          className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          Proceed to payment
        </button>
      </form>
    </div>
  );
}


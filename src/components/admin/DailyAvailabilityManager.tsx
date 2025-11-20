"use client";

import { useState, useEffect } from "react";

type Location = {
  id: number;
  name: string;
};

type TableType = {
  id: number;
  paxSize: number;
};

type TimeSlot = {
  id: number;
  slot: string;
  isActive: boolean;
};

export default function DailyAvailabilityManager() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [tableTypes, setTableTypes] = useState<TableType[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [form, setForm] = useState({
    locationId: "",
    date: "",
    timeSlot: "",
    tableTypeId: "",
    totalTables: "",
    availableTables: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/public/locations")
      .then((res) => res.json())
      .then(setLocations);
    fetch("/api/public/table-types")
      .then((res) => res.json())
      .then(setTableTypes);
    fetch("/api/admin/time-slots?activeOnly=true")
      .then((res) => res.json())
      .then(setTimeSlots);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locationId: Number(form.locationId),
          tableTypeId: Number(form.tableTypeId),
          totalTables: Number(form.totalTables),
          availableTables: Number(form.availableTables)
        })
      });
      if (res.ok) {
        setMessage("Availability created successfully");
        setForm({
          locationId: "",
          date: "",
          timeSlot: "",
          tableTypeId: "",
          totalTables: "",
          availableTables: ""
        });
      } else {
        setMessage("Failed to create availability");
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-900">Daily Availability</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Location</span>
            <select
              value={form.locationId}
              onChange={(e) => setForm({ ...form, locationId: e.target.value })}
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
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Time Slot</span>
            <select
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="">Select</option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.slot}>
                  {slot.slot}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Table Type</span>
            <select
              value={form.tableTypeId}
              onChange={(e) => setForm({ ...form, tableTypeId: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="">Select</option>
              {tableTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.paxSize} seater
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Total Tables</span>
            <input
              type="number"
              value={form.totalTables}
              onChange={(e) => setForm({ ...form, totalTables: e.target.value })}
              required
              min="0"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-600">Available Tables</span>
            <input
              type="number"
              value={form.availableTables}
              onChange={(e) => setForm({ ...form, availableTables: e.target.value })}
              required
              min="0"
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
        {message && <p className="text-sm text-slate-600">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-primary px-6 py-2 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Availability"}
        </button>
      </form>
    </div>
  );
}

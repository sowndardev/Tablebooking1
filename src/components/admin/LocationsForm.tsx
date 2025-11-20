"use client";

import { useEffect, useState } from "react";

type Location = {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
};

export default function LocationsForm() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState({ name: "", address: "", isActive: true });
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/locations");
    if (res.ok) setLocations(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ name: "", address: "", isActive: true });
      setMessage("Location saved");
      load();
    } else {
      setMessage("Failed to save location");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-primary">Locations</h2>
      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-3">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        />
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        />
        <button className="rounded-full bg-primary px-5 py-2 font-semibold text-white">Add location</button>
      </form>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
      <ul className="mt-4 divide-y divide-slate-100">
        {locations.map((loc) => (
          <li key={loc.id} className="py-3 text-sm">
            <p className="font-semibold">{loc.name}</p>
            <p className="text-slate-500">{loc.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}


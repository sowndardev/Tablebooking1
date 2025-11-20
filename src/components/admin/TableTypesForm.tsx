"use client";

import { useEffect, useState } from "react";

type TableType = {
  id: number;
  paxSize: number;
  description?: string;
};

export default function TableTypesForm() {
  const [types, setTypes] = useState<TableType[]>([]);
  const [form, setForm] = useState({ paxSize: "", description: "" });

  const load = async () => {
    const res = await fetch("/api/admin/table-types");
    if (res.ok) setTypes(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/table-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, paxSize: Number(form.paxSize) })
    });
    setForm({ paxSize: "", description: "" });
    load();
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-primary">Table sizes</h2>
      <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-3">
        <input
          type="number"
          value={form.paxSize}
          onChange={(e) => setForm({ ...form, paxSize: e.target.value })}
          placeholder="PAX size"
          className="rounded-lg border border-slate-200 px-3 py-2"
          required
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="rounded-lg border border-slate-200 px-3 py-2"
        />
        <button className="rounded-full bg-primary px-5 py-2 font-semibold text-white">Add table size</button>
      </form>
      <ul className="mt-4 flex flex-wrap gap-2 text-sm">
        {types.map((type) => (
          <li key={type.id} className="rounded-full border border-slate-200 px-4 py-2">
            {type.paxSize} pax
          </li>
        ))}
      </ul>
    </div>
  );
}


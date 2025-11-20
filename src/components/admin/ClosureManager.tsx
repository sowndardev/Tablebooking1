"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

type Location = {
    id: number;
    name: string;
};

type Closure = {
    id: number;
    locationId: number | null;
    startDate: string;
    endDate: string;
    reason: string;
    location: { name: string } | null;
};

export default function ClosureManager() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [closures, setClosures] = useState<Closure[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        locationId: "",
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
        reason: ""
    });

    useEffect(() => {
        fetch("/api/public/locations")
            .then((res) => res.json())
            .then(setLocations);
        loadClosures();
    }, []);

    const loadClosures = async () => {
        const res = await fetch("/api/admin/closures");
        if (res.ok) {
            setClosures(await res.json());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/closures", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationId: form.locationId || null,
                    startDate: form.startDate,
                    endDate: form.endDate,
                    reason: form.reason
                })
            });

            if (res.ok) {
                setMessage("✅ Closure created successfully");
                setForm({
                    locationId: "",
                    startDate: dayjs().format("YYYY-MM-DD"),
                    endDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
                    reason: ""
                });
                loadClosures();
            } else {
                setMessage("❌ Failed to create closure");
            }
        } catch (error) {
            setMessage("❌ An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const deleteClosure = async (id: number) => {
        if (!confirm("Are you sure you want to delete this closure?")) return;

        const res = await fetch(`/api/admin/closures/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            loadClosures();
        }
    };

    return (
        <div className="space-y-6">
            {/* Create Closure Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Closure</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">
                                Location <span className="text-slate-400">(Leave empty for all locations)</span>
                            </span>
                            <select
                                value={form.locationId}
                                onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            >
                                <option value="">All Locations</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">Reason *</span>
                            <input
                                type="text"
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                placeholder="e.g., Holiday, Renovation"
                                required
                                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            />
                        </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">Start Date *</span>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                required
                                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">End Date *</span>
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                required
                                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            />
                        </label>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Add Closure"}
                        </button>
                        {message && (
                            <p className={`text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            {/* Closures List */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Scheduled Closures</h2>
                {closures.length === 0 ? (
                    <p className="text-sm text-slate-500">No closures scheduled</p>
                ) : (
                    <div className="space-y-2">
                        {closures.map((closure) => (
                            <div
                                key={closure.id}
                                className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <p className="font-medium text-slate-900">{closure.reason}</p>
                                        {closure.location ? (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                {closure.location.name}
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                All Locations
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {dayjs(closure.startDate).format("MMM D, YYYY")} - {dayjs(closure.endDate).format("MMM D, YYYY")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteClosure(closure.id)}
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

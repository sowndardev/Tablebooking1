"use client";

import { useEffect, useState } from "react";

type TimeSlot = {
    id: number;
    slot: string;
    isActive: boolean;
    sortOrder: number;
};

export default function TimeSlotManager() {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [newSlot, setNewSlot] = useState({ start: "", end: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchTimeSlots = async () => {
        const res = await fetch("/api/admin/time-slots");
        if (res.ok) {
            setTimeSlots(await res.json());
        }
    };

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    const handleAddSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSlot.start || !newSlot.end) return;

        setLoading(true);
        setMessage("");

        try {
            const slot = `${newSlot.start}-${newSlot.end}`;
            const res = await fetch("/api/admin/time-slots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slot })
            });

            if (res.ok) {
                setMessage("Time slot added successfully");
                setNewSlot({ start: "", end: "" });
                fetchTimeSlots();
            } else {
                const data = await res.json();
                setMessage(data.message || "Failed to add time slot");
            }
        } catch (error) {
            setMessage("Failed to add time slot");
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (id: number, isActive: boolean) => {
        const res = await fetch(`/api/admin/time-slots/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !isActive })
        });

        if (res.ok) {
            fetchTimeSlots();
        }
    };

    const deleteSlot = async (id: number) => {
        if (!confirm("Are you sure you want to delete this time slot?")) return;

        const res = await fetch(`/api/admin/time-slots/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            fetchTimeSlots();
        }
    };

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Time Slot Management</h2>
            <p className="text-sm text-slate-500 mt-1">Manage available booking time slots</p>

            {/* Add New Slot */}
            <form onSubmit={handleAddSlot} className="mt-4 flex gap-3">
                <input
                    type="time"
                    value={newSlot.start}
                    onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    required
                />
                <span className="self-center text-slate-500">to</span>
                <input
                    type="time"
                    value={newSlot.end}
                    onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Slot"}
                </button>
            </form>

            {message && (
                <p className={`mt-2 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}

            {/* Existing Slots */}
            <div className="mt-6 space-y-2">
                {timeSlots.map((slot) => (
                    <div
                        key={slot.id}
                        className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-medium ${slot.isActive ? "text-slate-900" : "text-slate-400"}`}>
                                {slot.slot}
                            </span>
                            {!slot.isActive && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                    Inactive
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleActive(slot.id, slot.isActive)}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                                {slot.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                                onClick={() => deleteSlot(slot.id)}
                                className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

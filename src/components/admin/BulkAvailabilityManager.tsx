"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

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

type SlotConfig = {
    timeSlots: string[]; // Multi-select array
    tableTypeId: string;
    totalTables: string;
    availableTables: string;
};

export default function BulkAvailabilityManager() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [tableTypes, setTableTypes] = useState<TableType[]>([]);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    const [form, setForm] = useState({
        locationId: "",
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().add(30, "day").format("YYYY-MM-DD"),
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6] // All days by default
    });

    const [slotConfigs, setSlotConfigs] = useState<SlotConfig[]>([
        { timeSlots: [], tableTypeId: "", totalTables: "4", availableTables: "4" }
    ]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const daysOfWeekOptions = [
        { value: 0, label: "Sun" },
        { value: 1, label: "Mon" },
        { value: 2, label: "Tue" },
        { value: 3, label: "Wed" },
        { value: 4, label: "Thu" },
        { value: 5, label: "Fri" },
        { value: 6, label: "Sat" }
    ];

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

    const toggleDay = (day: number) => {
        setForm({
            ...form,
            daysOfWeek: form.daysOfWeek.includes(day)
                ? form.daysOfWeek.filter((d) => d !== day)
                : [...form.daysOfWeek, day]
        });
    };

    const toggleTimeSlot = (index: number, slot: string) => {
        const updated = [...slotConfigs];
        const currentSlots = updated[index].timeSlots;
        updated[index].timeSlots = currentSlots.includes(slot)
            ? currentSlots.filter((s) => s !== slot)
            : [...currentSlots, slot];
        setSlotConfigs(updated);
    };

    const addSlotConfig = () => {
        setSlotConfigs([
            ...slotConfigs,
            { timeSlots: [], tableTypeId: "", totalTables: "4", availableTables: "4" }
        ]);
    };

    const removeSlotConfig = (index: number) => {
        setSlotConfigs(slotConfigs.filter((_, i) => i !== index));
    };

    const updateSlotConfig = (index: number, field: keyof Omit<SlotConfig, 'timeSlots'>, value: string) => {
        const updated = [...slotConfigs];
        updated[index][field] = value;
        setSlotConfigs(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Flatten slot configs: for each config, create one entry per selected time slot
            const expandedSlots = slotConfigs.flatMap((config) =>
                config.timeSlots.map((timeSlot) => ({
                    timeSlot,
                    tableTypeId: Number(config.tableTypeId),
                    totalTables: Number(config.totalTables),
                    availableTables: Number(config.availableTables)
                }))
            );

            const res = await fetch("/api/admin/availability/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    locationId: Number(form.locationId),
                    startDate: form.startDate,
                    endDate: form.endDate,
                    daysOfWeek: form.daysOfWeek,
                    slots: expandedSlots
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessage(`✅ ${data.message}`);
            } else {
                const data = await res.json();
                setMessage(`❌ ${data.message || "Failed to create availability"}`);
            }
        } catch (error) {
            setMessage("❌ An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const daysDiff = dayjs(form.endDate).diff(dayjs(form.startDate), "day") + 1;
    const totalSlotsPerDay = slotConfigs.reduce((sum, config) => sum + config.timeSlots.length, 0);
    const estimatedSlots = daysDiff * totalSlotsPerDay;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Bulk Availability Creation</h1>
                <p className="text-sm text-slate-500 mt-1">Create availability for multiple days at once</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location & Date Range */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Date Range & Location</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-600">Location *</span>
                            <select
                                value={form.locationId}
                                onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                                required
                                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                            >
                                <option value="">Select Location</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                        </label>
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

                    {/* Days of Week */}
                    <div className="mt-4">
                        <span className="text-sm font-medium text-slate-600 block mb-2">Days of Week</span>
                        <div className="flex gap-2">
                            {daysOfWeekOptions.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => toggleDay(day.value)}
                                    className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${form.daysOfWeek.includes(day.value)
                                            ? "bg-primary text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }
                  `}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">
                            📅 Creating for <strong>{daysDiff} days</strong> ({form.daysOfWeek.length} days/week selected)
                        </p>
                    </div>
                </div>

                {/* Slot Configurations */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Availability Slots</h2>
                        <button
                            type="button"
                            onClick={addSlotConfig}
                            className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                            + Add Configuration
                        </button>
                    </div>

                    <div className="space-y-4">
                        {slotConfigs.map((config, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                {/* Time Slots - Multi-select with checkboxes */}
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-2">
                                        Time Slots * (Select multiple)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {timeSlots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => toggleTimeSlot(index, slot.slot)}
                                                className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-colors border
                          ${config.timeSlots.includes(slot.slot)
                                                        ? "bg-primary text-white border-primary"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-primary"
                                                    }
                        `}
                                            >
                                                {config.timeSlots.includes(slot.slot) && "✓ "}
                                                {slot.slot}
                                            </button>
                                        ))}
                                    </div>
                                    {config.timeSlots.length > 0 && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            Selected: {config.timeSlots.join(", ")}
                                        </p>
                                    )}
                                </div>

                                {/* Table Type and Counts */}
                                <div className="grid gap-3 md:grid-cols-4">
                                    <select
                                        value={config.tableTypeId}
                                        onChange={(e) => updateSlotConfig(index, "tableTypeId", e.target.value)}
                                        required
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    >
                                        <option value="">Table Type *</option>
                                        {tableTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.paxSize} seater
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={config.totalTables}
                                        onChange={(e) => updateSlotConfig(index, "totalTables", e.target.value)}
                                        placeholder="Total Tables"
                                        required
                                        min="0"
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="number"
                                        value={config.availableTables}
                                        onChange={(e) => updateSlotConfig(index, "availableTables", e.target.value)}
                                        placeholder="Available"
                                        required
                                        min="0"
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSlotConfig(index)}
                                        disabled={slotConfigs.length === 1}
                                        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-30"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm text-amber-900">
                            ⚡ Will create approximately <strong>{estimatedSlots} availability slots</strong>
                        </p>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-full bg-primary px-8 py-3 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Bulk Availability"}
                    </button>
                    {message && (
                        <p className={`text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

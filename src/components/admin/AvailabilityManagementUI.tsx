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

type Availability = {
    id: number;
    locationId: number;
    date: string;
    timeSlot: string;
    tableTypeId: number;
    totalTables: number;
    availableTables: number;
    location: { name: string };
    tableType: { paxSize: number };
};

export default function AvailabilityManagementUI() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [tableTypes, setTableTypes] = useState<TableType[]>([]);
    const [availability, setAvailability] = useState<Availability[]>([]);

    const [filters, setFilters] = useState({
        locationId: "",
        date: dayjs().format("YYYY-MM-DD")
    });

    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        totalTables: "",
        availableTables: ""
    });

    useEffect(() => {
        fetch("/api/public/locations")
            .then((res) => res.json())
            .then(setLocations);
        fetch("/api/public/table-types")
            .then((res) => res.json())
            .then(setTableTypes);
    }, []);

    const loadAvailability = async () => {
        if (!filters.locationId || !filters.date) return;

        setLoading(true);
        const params = new URLSearchParams({
            locationId: filters.locationId,
            date: filters.date
        });

        const res = await fetch(`/api/admin/availability?${params.toString()}`);
        if (res.ok) {
            setAvailability(await res.json());
        }
        setLoading(false);
    };

    useEffect(() => {
        if (filters.locationId && filters.date) {
            loadAvailability();
        }
    }, [filters.locationId, filters.date]);

    const startEdit = (item: Availability) => {
        setEditingId(item.id);
        setEditForm({
            totalTables: item.totalTables.toString(),
            availableTables: item.availableTables.toString()
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ totalTables: "", availableTables: "" });
    };

    const saveEdit = async (id: number) => {
        const res = await fetch(`/api/admin/availability/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                totalTables: Number(editForm.totalTables),
                availableTables: Number(editForm.availableTables)
            })
        });

        if (res.ok) {
            loadAvailability();
            cancelEdit();
        }
    };

    const deleteSlot = async (id: number) => {
        if (!confirm("Are you sure you want to delete this availability slot?")) return;

        const res = await fetch(`/api/admin/availability/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            loadAvailability();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Manage Availability</h1>
                <p className="text-sm text-slate-500">Select a date to manage &quot;Daily Availability&quot; or &quot;Closures&quot;.</p>
            </div>

            {/* Filters */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Filter</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-slate-600">Location *</span>
                        <select
                            value={filters.locationId}
                            onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
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
                        <span className="text-sm font-medium text-slate-600">Date *</span>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                    </label>
                </div>
            </div>

            {/* Availability List */}
            {filters.locationId && filters.date && (
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Availability for {dayjs(filters.date).format("MMM D, YYYY")}
                    </h2>

                    {loading ? (
                        <p className="text-sm text-slate-500">Loading...</p>
                    ) : availability.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-500">No availability slots found for this date.</p>
                            <p className="text-sm text-slate-400 mt-2">
                                Use &quot;Daily Availability&quot; to create bulk slots.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {availability.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50"
                                >
                                    <div className="flex-1 grid grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500">Time Slot</p>
                                            <p className="font-medium text-slate-900">{item.timeSlot}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Table Type</p>
                                            <p className="font-medium text-slate-900">{item.tableType.paxSize} seater</p>
                                        </div>
                                        {editingId === item.id ? (
                                            <>
                                                <div>
                                                    <p className="text-xs text-slate-500">Total Tables</p>
                                                    <input
                                                        type="number"
                                                        value={editForm.totalTables}
                                                        onChange={(e) => setEditForm({ ...editForm, totalTables: e.target.value })}
                                                        min="0"
                                                        className="w-20 rounded border border-slate-200 px-2 py-1 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Available</p>
                                                    <input
                                                        type="number"
                                                        value={editForm.availableTables}
                                                        onChange={(e) => setEditForm({ ...editForm, availableTables: e.target.value })}
                                                        min="0"
                                                        className="w-20 rounded border border-slate-200 px-2 py-1 text-sm"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className="text-xs text-slate-500">Total Tables</p>
                                                    <p className="font-medium text-slate-900">{item.totalTables}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Available</p>
                                                    <p className="font-medium text-slate-900">{item.availableTables}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        {editingId === item.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(item.id)}
                                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="text-sm font-medium text-slate-600 hover:text-slate-700"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteSlot(item.id)}
                                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

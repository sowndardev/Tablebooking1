"use client";

import { useState } from "react";

type Reservation = {
    id: number;
    bookingCode: string;
    customerName: string;
    customerPhone: string;
    location: { name: string };
    date: string;
    timeSlot: string;
    requestedPax: number;
    tableType: { paxSize: number };
    status: string;
    paymentStatus: string;
    source: string;
    createdAt: string;
};

type Props = {
    reservation: Reservation;
    onClose: () => void;
    onUpdate: () => void;
};

export default function EditReservationModal({ reservation, onClose, onUpdate }: Props) {
    const [form, setForm] = useState({
        status: reservation.status,
        paymentStatus: reservation.paymentStatus,
        requestedPax: reservation.requestedPax,
        timeSlot: reservation.timeSlot,
        date: reservation.date,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reservations/${reservation.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error("Failed to update reservation", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this reservation?")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/reservations/${reservation.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error("Failed to delete reservation", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Edit Reservation</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </div>

                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Customer</p>
                        <p className="text-lg font-semibold text-slate-900">
                            {reservation.customerName} <span className="text-sm font-normal text-slate-500">({reservation.customerPhone})</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                                >
                                    <option value="PENDING_PAYMENT">Pending Payment</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="NO_SHOW">No Show</option>
                                    <option value="PAYMENT_FAILED">Payment Failed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Payment</label>
                                <select
                                    value={form.paymentStatus}
                                    onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                                >
                                    <option value="UNPAID">Unpaid</option>
                                    <option value="PAID">Paid</option>
                                    <option value="REFUNDED">Refunded</option>
                                    <option value="FAILED">Failed</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Date</label>
                                <input
                                    type="date"
                                    value={form.date.split("T")[0]}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Time Slot</label>
                                <select
                                    value={form.timeSlot}
                                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                                >
                                    <option value="18:00-19:00">18:00-19:00</option>
                                    <option value="19:00-20:00">19:00-20:00</option>
                                    <option value="20:00-21:00">20:00-21:00</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Guests</label>
                                <input
                                    type="number"
                                    value={form.requestedPax}
                                    onChange={(e) => setForm({ ...form, requestedPax: Number(e.target.value) })}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Delete Reservation
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

"use client";

import dayjs from "dayjs";

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
};

export default function ReservationDetailsModal({ reservation, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Reservation Details</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                        <div>
                            <p className="text-sm text-slate-500">Booking Code</p>
                            <p className="text-xl font-bold text-slate-900">{reservation.bookingCode}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Status</p>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${reservation.status === "CONFIRMED"
                                        ? "bg-green-100 text-green-800"
                                        : reservation.status === "CANCELLED"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {reservation.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Customer</p>
                            <p className="font-semibold text-slate-900">{reservation.customerName}</p>
                            <p className="text-sm text-slate-600">{reservation.customerPhone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Guests</p>
                            <p className="font-semibold text-slate-900">{reservation.requestedPax} People</p>
                            <p className="text-sm text-slate-600">{reservation.tableType.paxSize} Seater Table</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Date & Time</p>
                            <p className="font-semibold text-slate-900">
                                {dayjs(reservation.date).format("MMM D, YYYY")}
                            </p>
                            <p className="text-sm text-slate-600">{reservation.timeSlot}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Location</p>
                            <p className="font-semibold text-slate-900">{reservation.location.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Payment</p>
                            <p className="font-semibold text-slate-900">{reservation.paymentStatus}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Source</p>
                            <p className="font-semibold text-slate-900">{reservation.source}</p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400">
                            Created on {dayjs(reservation.createdAt).format("MMM D, YYYY h:mm A")}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

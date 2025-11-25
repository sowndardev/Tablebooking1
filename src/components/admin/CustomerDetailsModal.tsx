"use client";

import { useEffect, useState } from "react";

type Reservation = {
    id: number;
    bookingCode: string;
    date: string;
    timeSlot: string;
    requestedPax: number;
    status: string;
    paymentStatus: string;
    source: string;
    notes: string | null;
    locationName: string;
    tableTypePax: number;
    createdAt: string;
};

type CustomerDetails = {
    customer: {
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
    };
    stats: {
        totalBookings: number;
        upcomingBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        firstBookingDate: string;
        lastBookingDate: string;
    };
    reservations: Reservation[];
};

type Props = {
    phone: string;
    onClose: () => void;
};

export default function CustomerDetailsModal({ phone, onClose }: Props) {
    const [details, setDetails] = useState<CustomerDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/customers/${encodeURIComponent(phone)}`);
                if (res.ok) {
                    setDetails(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch customer details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [phone]);

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            CONFIRMED: "bg-green-100 text-green-800",
            PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
            CANCELLED: "bg-red-100 text-red-800",
            COMPLETED: "bg-blue-100 text-blue-800",
        };
        return styles[status] || "bg-slate-100 text-slate-800";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="border-b border-slate-200 bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            {loading ? (
                                <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {details?.customer.customerName}
                                    </h2>
                                    <div className="mt-1 space-y-1 text-sm text-slate-600">
                                        <p>📞 {details?.customer.customerPhone}</p>
                                        {details?.customer.customerEmail && (
                                            <p>✉️ {details.customer.customerEmail}</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                {!loading && details && (
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{details.stats.totalBookings}</div>
                            <div className="text-xs text-slate-600">Total Bookings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{details.stats.upcomingBookings}</div>
                            <div className="text-xs text-slate-600">Upcoming</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{details.stats.completedBookings}</div>
                            <div className="text-xs text-slate-600">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{details.stats.cancelledBookings}</div>
                            <div className="text-xs text-slate-600">Cancelled</div>
                        </div>
                    </div>
                )}

                {/* Booking History */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 280px)" }}>
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Booking History</h3>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
                            ))}
                        </div>
                    ) : details && details.reservations.length > 0 ? (
                        <div className="space-y-3">
                            {details.reservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-semibold text-primary">
                                                    {reservation.bookingCode}
                                                </span>
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                                                    {reservation.status.replace(/_/g, " ")}
                                                </span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600 md:grid-cols-3">
                                                <div>📅 {formatDate(reservation.date)}</div>
                                                <div>🕐 {reservation.timeSlot}</div>
                                                <div>👥 {reservation.requestedPax} guests</div>
                                                <div>📍 {reservation.locationName}</div>
                                                <div>💳 {reservation.paymentStatus}</div>
                                                <div>📱 {reservation.source}</div>
                                            </div>
                                            {reservation.notes && (
                                                <div className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-600">
                                                    <span className="font-medium">Note:</span> {reservation.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500">
                            No booking history found
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded-full bg-slate-200 px-6 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

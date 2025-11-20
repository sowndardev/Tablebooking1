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
    status: string;
    paymentStatus: string;
};

type Props = {
    date: string;
    reservations: Reservation[];
    onClose: () => void;
    onEdit: (res: Reservation) => void;
};

export default function DateDetailsModal({ date, reservations, onClose, onEdit }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        Bookings for {dayjs(date).format("MMMM D, YYYY")}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        ✕
                    </button>
                </div>

                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    {reservations.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">No bookings for this date.</p>
                    ) : (
                        <div className="space-y-3">
                            {reservations.map((res) => (
                                <div
                                    key={res.id}
                                    className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-900">{res.bookingCode}</span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${res.status === "CONFIRMED"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-orange-50 text-orange-700"
                                                    }`}
                                            >
                                                {res.status}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-slate-600">
                                            {res.customerName} ({res.requestedPax} guests)
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {res.timeSlot} · {res.location.name}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onEdit(res)}
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white hover:shadow-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

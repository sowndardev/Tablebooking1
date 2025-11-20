"use client";

type Reservation = {
    id: number;
    status: string;
    paymentStatus: string;
    requestedPax: number;
    date: string;
};

export default function DashboardStats({ reservations }: { reservations: Reservation[] }) {
    const totalBookings = reservations.length;
    const totalGuests = reservations.reduce((acc, res) => acc + res.requestedPax, 0);
    const confirmed = reservations.filter((res) => res.status === "CONFIRMED").length;
    const pending = reservations.filter((res) => res.status === "PENDING_PAYMENT").length;

    const stats = [
        { label: "Total Bookings", value: totalBookings, icon: "📅", color: "bg-blue-50 text-blue-600" },
        { label: "Total Guests", value: totalGuests, icon: "👥", color: "bg-purple-50 text-purple-600" },
        { label: "Confirmed", value: confirmed, icon: "✅", color: "bg-green-50 text-green-600" },
        { label: "Pending", value: pending, icon: "⏳", color: "bg-orange-50 text-orange-600" },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

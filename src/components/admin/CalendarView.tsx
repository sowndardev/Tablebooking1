"use client";

import { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";

type Reservation = {
    id: number;
    date: string;
    status: string;
};

export default function CalendarView({
    reservations,
    onDateSelect,
}: {
    reservations: Reservation[];
    onDateSelect: (date: string) => void;
}) {
    const [currentDate, setCurrentDate] = useState(dayjs());

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
    const daysInMonth = currentDate.daysInMonth();

    const days = [];
    // Add empty slots for days before the start of the month
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(startOfMonth.date(i));
    }

    const getBookingsForDay = (date: dayjs.Dayjs) => {
        return reservations.filter((res) => dayjs(res.date).isSame(date, "day"));
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                    {currentDate.format("MMMM YYYY")}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                    >
                        ← Prev
                    </button>
                    <button
                        onClick={() => setCurrentDate(dayjs())}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setCurrentDate(currentDate.add(1, "month"))}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50"
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-200 overflow-hidden rounded-lg border border-slate-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="bg-slate-50 py-2 text-center text-xs font-semibold text-slate-500">
                        {day}
                    </div>
                ))}
                {days.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} className="bg-white min-h-[100px]" />;

                    const bookings = getBookingsForDay(date);
                    const isToday = date.isSame(dayjs(), "day");

                    return (
                        <div
                            key={date.toString()}
                            onClick={() => onDateSelect(date.format("YYYY-MM-DD"))}
                            className={clsx(
                                "group relative min-h-[100px] cursor-pointer bg-white p-2 transition-colors hover:bg-slate-50",
                                isToday && "bg-blue-50/30"
                            )}
                        >
                            <span
                                className={clsx(
                                    "flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium",
                                    isToday ? "bg-primary text-white" : "text-slate-700"
                                )}
                            >
                                {date.date()}
                            </span>
                            <div className="mt-2 space-y-1">
                                {bookings.slice(0, 3).map((res) => (
                                    <div
                                        key={res.id}
                                        className={clsx(
                                            "h-1.5 rounded-full",
                                            res.status === "CONFIRMED" ? "bg-green-400" : "bg-orange-400"
                                        )}
                                    />
                                ))}
                                {bookings.length > 3 && (
                                    <div className="text-[10px] text-slate-400">+{bookings.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

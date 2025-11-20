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

export default function ReservationsTable({
  reservations,
  loading,
  onRefresh,
  onEdit,
  onView,
}: {
  reservations: Reservation[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (res: Reservation) => void;
  onView: (res: Reservation) => void;
}) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = !search ||
      res.customerName.toLowerCase().includes(search.toLowerCase()) ||
      res.customerPhone.includes(search) ||
      res.bookingCode.toLowerCase().includes(search.toLowerCase());

    const matchesDate = !dateFilter || res.date.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Search by name, phone or code"
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button
          onClick={onRefresh}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>
      {loading && <p className="mt-4 text-sm text-slate-500">Loading reservations...</p>}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="px-3 py-3 font-medium">Code</th>
              <th className="px-3 py-3 font-medium">Guest</th>
              <th className="px-3 py-3 font-medium">Schedule</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Payment</th>
              <th className="px-3 py-3 font-medium">Source</th>
              <th className="px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="px-3 py-3 font-semibold text-slate-700">{res.bookingCode}</td>
                <td className="px-3 py-3">
                  <div className="font-medium text-slate-900">{res.customerName}</div>
                  <div className="text-xs text-slate-500">{res.customerPhone}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="text-slate-900">{res.location.name}</div>
                  <div className="text-xs text-slate-500">
                    {res.date.slice(0, 10)} · {res.timeSlot}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${res.status === "CONFIRMED"
                      ? "bg-green-50 text-green-700"
                      : res.status === "CANCELLED"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                      }`}
                  >
                    {res.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${res.paymentStatus === "PAID"
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {res.paymentStatus}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-500">{res.source}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onView(res)}
                      className="text-slate-600 hover:text-slate-900 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(res)}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReservations.length === 0 && !loading && (
          <p className="py-8 text-center text-slate-500">No reservations found.</p>
        )}
      </div>
    </div>
  );
}


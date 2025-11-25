"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import DashboardStats from "@/components/admin/DashboardStats";
import AdminCalendarView from "@/components/admin/CalendarView";
import AdminReservationsTable from "@/components/admin/ReservationsTable";
import EditReservationModal from "@/components/admin/EditReservationModal";
import DateDetailsModal from "@/components/admin/DateDetailsModal";
import ReservationDetailsModal from "@/components/admin/ReservationDetailsModal";

export default function AdminHomePage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [viewingReservation, setViewingReservation] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reservations");
      if (res.ok) {
        setReservations(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getReservationsForDate = (date: string) => {
    return reservations.filter((res) => res.date.startsWith(date));
  };

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setView("list")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${view === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              List View
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${view === "calendar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              Calendar
            </button>
          </div>
        </div>

        <DashboardStats reservations={reservations} />

        {view === "calendar" ? (
          <AdminCalendarView
            reservations={reservations}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        ) : (
          <AdminReservationsTable
            reservations={reservations}
            loading={loading}
            onRefresh={fetchReservations}
            onEdit={(res) => setEditingReservation(res)}
            onView={(res) => setViewingReservation(res)}
          />
        )}

        {editingReservation && (
          <EditReservationModal
            reservation={editingReservation}
            onClose={() => setEditingReservation(null)}
            onUpdate={fetchReservations}
          />
        )}

        {viewingReservation && (
          <ReservationDetailsModal
            reservation={viewingReservation}
            onClose={() => setViewingReservation(null)}
          />
        )}

        {selectedDate && (
          <DateDetailsModal
            date={selectedDate}
            reservations={getReservationsForDate(selectedDate)}
            onClose={() => setSelectedDate(null)}
            onEdit={(res) => {
              setEditingReservation(res);
              setSelectedDate(null); // Close details modal when opening edit modal
            }}
          />
        )}
      </div>
    </AdminGuard>
  );
}

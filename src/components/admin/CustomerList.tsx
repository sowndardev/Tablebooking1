"use client";

import { useEffect, useState } from "react";
import CustomerDetailsModal from "./CustomerDetailsModal";

type Customer = {
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    firstBookingDate: string;
    lastBookingDate: string;
};

type Props = {
    onExport: () => void;
};

export default function CustomerList({ onExport }: Props) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("lastBooking");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
    const [stats, setStats] = useState({ totalCustomers: 0, activeCustomers: 0 });

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search,
                sortBy,
                sortOrder,
            });
            const res = await fetch(`/api/admin/customers?${params}`);
            if (res.ok) {
                const data = await res.json();
                setCustomers(data.customers);
                setStats({
                    totalCustomers: data.totalCustomers,
                    activeCustomers: data.activeCustomers,
                });
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, sortBy, sortOrder]);

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) {
            return <span className="text-slate-400">↕️</span>;
        }
        return <span>{sortOrder === "asc" ? "↑" : "↓"}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                    <div className="text-3xl font-bold text-primary">{stats.totalCustomers}</div>
                    <div className="text-sm text-slate-600">Total Customers</div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-green-100 to-green-50 p-6">
                    <div className="text-3xl font-bold text-green-700">{stats.activeCustomers}</div>
                    <div className="text-sm text-slate-600">Active Customers</div>
                </div>
            </div>

            {/* Search and Export */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search by name, phone, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <svg
                        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Export CSV
                </button>
            </div>

            {/* Customer Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-1">
                                        Customer <SortIcon field="name" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Contact
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                                    onClick={() => handleSort("totalBookings")}
                                >
                                    <div className="flex items-center gap-1">
                                        Bookings <SortIcon field="totalBookings" />
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                                    onClick={() => handleSort("lastBooking")}
                                >
                                    <div className="flex items-center gap-1">
                                        Last Booking <SortIcon field="lastBooking" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            Loading customers...
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        {search ? "No customers found matching your search" : "No customers yet"}
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr
                                        key={customer.customerPhone}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{customer.customerName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600">{customer.customerPhone}</div>
                                            {customer.customerEmail && (
                                                <div className="text-xs text-slate-500">{customer.customerEmail}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-primary">{customer.totalBookings}</span>
                                                <span className="text-xs text-slate-500">
                                                    ({customer.upcomingBookings} upcoming)
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {formatDate(customer.lastBookingDate)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedPhone(customer.customerPhone)}
                                                className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Details Modal */}
            {selectedPhone && (
                <CustomerDetailsModal
                    phone={selectedPhone}
                    onClose={() => setSelectedPhone(null)}
                />
            )}
        </div>
    );
}

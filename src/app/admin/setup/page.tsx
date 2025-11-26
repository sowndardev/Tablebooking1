"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuardComponent";
import LocationsForm from "@/components/admin/LocationsForm";
import TableTypesForm from "@/components/admin/TableTypesForm";
import TimeSlotManager from "@/components/admin/TimeSlotManager";
import ClosureManager from "@/components/admin/ClosureManager";

type Tab = "timeslots" | "locations" | "tabletypes" | "closures";

export default function AdminSetupPage() {
    const [activeTab, setActiveTab] = useState<Tab>("timeslots");

    const tabs = [
        { id: "timeslots" as Tab, label: "Time Slots", icon: "🕐" },
        { id: "locations" as Tab, label: "Locations", icon: "📍" },
        { id: "tabletypes" as Tab, label: "Table Types (PAX)", icon: "🪑" },
        { id: "closures" as Tab, label: "Closures", icon: "🚫" }
    ];

    return (
        <AdminGuard>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Setup & Configuration</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage time slots, locations, and table types in one place</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                    }
                `}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "timeslots" && <TimeSlotManager />}
                    {activeTab === "locations" && <LocationsForm />}
                    {activeTab === "tabletypes" && <TableTypesForm />}
                    {activeTab === "closures" && <ClosureManager />}
                </div>
            </div>
        </AdminGuard>
    );
}

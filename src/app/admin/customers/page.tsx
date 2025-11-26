"use client";

import AdminGuard from "@/components/admin/AdminGuardComponent";
import CustomerList from "@/components/admin/CustomerList";

export default function CustomersPage() {
    const handleExport = async () => {
        try {
            const res = await fetch("/api/admin/customers/export");
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert("Failed to export customers");
            }
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export customers");
        }
    };

    return (
        <AdminGuard>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Customer Management (CRM)</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            View and manage customer data and booking history
                        </p>
                    </div>
                </div>

                <CustomerList onExport={handleExport} />
            </div>
        </AdminGuard>
    );
}

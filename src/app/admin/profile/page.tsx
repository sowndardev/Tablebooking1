"use client";

import AdminGuard from "@/components/AdminGuardComponent";

export default function AdminProfilePage() {
    return (
        <AdminGuard>
            <div className="max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold text-slate-900">Admin Profile</h1>
                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Email Address</label>
                            <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
                                admin@restaurant.local
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600">Role</label>
                            <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500">
                                Super Admin
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
                    <form className="mt-4 space-y-4">
                        <input
                            type="password"
                            placeholder="Current Password"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2"
                        />
                        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </AdminGuard>
    );
}

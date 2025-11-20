import AdminGuard from "@/components/AdminGuard";
import AvailabilityManagementUI from "@/components/admin/AvailabilityManagementUI";

export default function ManageAvailabilityPage() {
    return (
        <AdminGuard>
            <AvailabilityManagementUI />
        </AdminGuard>
    );
}

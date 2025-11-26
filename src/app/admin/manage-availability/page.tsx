import AdminGuard from "@/components/admin/AdminGuardComponent";
import AvailabilityManagementUI from "@/components/admin/AvailabilityManagementUI";

export default function ManageAvailabilityPage() {
    return (
        <AdminGuard>
            <AvailabilityManagementUI />
        </AdminGuard>
    );
}

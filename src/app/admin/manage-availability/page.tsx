import AdminGuard from "@/components/AdminGuardComponent";
import AvailabilityManagementUI from "@/components/admin/AvailabilityManagementUI";

export default function ManageAvailabilityPage() {
    return (
        <AdminGuard>
            <AvailabilityManagementUI />
        </AdminGuard>
    );
}

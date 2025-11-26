import AdminGuard from "@/components/admin/AdminGuardComponent";
import BulkAvailabilityManager from "@/components/admin/BulkAvailabilityManager";

export default function AvailabilityPage() {
  return (
    <AdminGuard>
      <BulkAvailabilityManager />
    </AdminGuard>
  );
}


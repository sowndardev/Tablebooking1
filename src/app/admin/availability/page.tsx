import AdminGuard from "@/components/AdminGuardComponent";
import BulkAvailabilityManager from "@/components/admin/BulkAvailabilityManager";

export default function AvailabilityPage() {
  return (
    <AdminGuard>
      <BulkAvailabilityManager />
    </AdminGuard>
  );
}


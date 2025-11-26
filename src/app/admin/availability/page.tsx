import AdminGuard from "@/components/AdminGuard";
import BulkAvailabilityManager from "@/components/admin/BulkAvailabilityManager";

export default function AvailabilityPage() {
  return (
    <AdminGuard>
      <BulkAvailabilityManager />
    </AdminGuard>
  );
}


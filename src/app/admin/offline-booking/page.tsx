import AdminGuard from "@/components/admin/AdminGuardComponent";
import OfflineBookingForm from "@/components/admin/OfflineBookingForm";

export default function OfflineBookingPage() {
  return (
    <AdminGuard>
      <OfflineBookingForm />
    </AdminGuard>
  );
}


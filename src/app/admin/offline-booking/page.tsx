import AdminGuard from "@/components/AdminGuardComponent";
import OfflineBookingForm from "@/components/admin/OfflineBookingForm";

export default function OfflineBookingPage() {
  return (
    <AdminGuard>
      <OfflineBookingForm />
    </AdminGuard>
  );
}


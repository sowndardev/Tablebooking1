import AdminGuard from "@/components/AdminGuard";
import OfflineBookingForm from "@/components/admin/OfflineBookingForm";

export default function OfflineBookingPage() {
  return (
    <AdminGuard>
      <OfflineBookingForm />
    </AdminGuard>
  );
}


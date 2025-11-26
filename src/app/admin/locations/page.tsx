import AdminGuard from "@/components/admin/AdminGuardComponent";
import LocationsForm from "@/components/admin/LocationsForm";

export default function AdminLocationsPage() {
  return (
    <AdminGuard>
      <LocationsForm />
    </AdminGuard>
  );
}


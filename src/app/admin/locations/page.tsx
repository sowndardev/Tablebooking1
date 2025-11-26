import AdminGuard from "@/components/AdminGuard";
import LocationsForm from "@/components/admin/LocationsForm";

export default function AdminLocationsPage() {
  return (
    <AdminGuard>
      <LocationsForm />
    </AdminGuard>
  );
}


import AdminGuard from "@/components/admin/AdminGuardComponent";
import TableTypesForm from "@/components/admin/TableTypesForm";

export default function TableTypesPage() {
  return (
    <AdminGuard>
      <TableTypesForm />
    </AdminGuard>
  );
}


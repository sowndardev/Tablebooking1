import AdminGuard from "@/components/AdminGuardComponent";
import TableTypesForm from "@/components/admin/TableTypesForm";

export default function TableTypesPage() {
  return (
    <AdminGuard>
      <TableTypesForm />
    </AdminGuard>
  );
}


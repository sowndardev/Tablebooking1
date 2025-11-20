import AdminGuard from "@/components/AdminGuard";
import TableTypesForm from "@/components/admin/TableTypesForm";

export default function TableTypesPage() {
  return (
    <AdminGuard>
      <TableTypesForm />
    </AdminGuard>
  );
}


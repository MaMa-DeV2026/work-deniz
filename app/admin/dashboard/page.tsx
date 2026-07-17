import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import DashboardClient from '@/components/admin/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdmin();
  return (
    <AdminLayout>
      <DashboardClient />
    </AdminLayout>
  );
}

import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import CareersManager from '@/components/admin/CareersManager';

export const dynamic = 'force-dynamic';

export default async function AdminCareersPage() {
  await requireAdmin();
  return (
    <AdminLayout>
      <CareersManager />
    </AdminLayout>
  );
}

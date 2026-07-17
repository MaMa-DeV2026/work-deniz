import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import CollectionsManager from '@/components/admin/CollectionsManager';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  await requireAdmin();
  return (
    <AdminLayout>
      <CollectionsManager />
    </AdminLayout>
  );
}

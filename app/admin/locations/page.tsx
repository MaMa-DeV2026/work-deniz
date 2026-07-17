import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import LocationsManager from '@/components/admin/LocationsManager';

export const dynamic = 'force-dynamic';

export default async function AdminLocationsPage() {
  await requireAdmin();
  return (
    <AdminLayout>
      <LocationsManager />
    </AdminLayout>
  );
}

import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import ContactsManager from '@/components/admin/ContactsManager';

export const dynamic = 'force-dynamic';

export default async function AdminContactsPage() {
  await requireAdmin();
  return (
    <AdminLayout>
      <ContactsManager />
    </AdminLayout>
  );
}

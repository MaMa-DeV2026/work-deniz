import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import ProductsManager from '@/components/admin/ProductsManager';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await requireAdmin();
  return (
    <AdminLayout>
      <ProductsManager />
    </AdminLayout>
  );
}

import { requireAdmin } from '@/lib/auth';
import AdminLayout from '@/components/layout/AdminLayout';
import BlogManager from '@/components/admin/BlogManager';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  await requireAdmin();
  return (
    <AdminLayout>
      <BlogManager />
    </AdminLayout>
  );
}

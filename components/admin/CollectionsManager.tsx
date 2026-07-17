'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminGet, adminSend } from '@/lib/admin-api';
import { slugify } from '@/lib/utils';

type Collection = {
  id: string;
  name_fa: string;
  name_en: string;
  slug: string;
  description_fa: string;
  description_en: string;
  coverImage: string;
  sortOrder: number;
  _count?: { products: number };
};

const EMPTY = {
  name_fa: '',
  name_en: '',
  slug: '',
  description_fa: '',
  description_en: '',
  coverImage: '',
  sortOrder: 0,
};

export default function CollectionsManager() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<Collection | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      const data = await adminGet<{ collections: Collection[] }>('/api/admin/collections');
      setItems(data.collections);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setModalOpen(true);
  }

  function openEdit(c: Collection) {
    setEditing(c);
    setForm({
      name_fa: c.name_fa,
      name_en: c.name_en,
      slug: c.slug,
      description_fa: c.description_fa,
      description_en: c.description_en,
      coverImage: c.coverImage,
      sortOrder: c.sortOrder,
    });
    setError('');
    setModalOpen(true);
  }

  function set(field: keyof typeof EMPTY, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await adminSend('/api/admin/collections', 'PUT', { id: editing.id, ...form });
      } else {
        await adminSend('/api/admin/collections', 'POST', form);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!confirm) return;
    setDeleting(true);
    try {
      await adminSend('/api/admin/collections', 'DELETE', { id: confirm.id });
      setConfirm(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-md font-semibold text-primary">Manage Collections</h1>
        <Button onClick={openAdd}>
          <Plus size={16} /> Add Collection
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-accent/60 bg-white">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-accent/60 bg-surface text-text-muted">
            <tr>
              <th className="p-4">Persian Name</th>
              <th className="p-4">English Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Products</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted">
                  <Loader2 className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted">
                  No collections found.
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="border-b border-accent/40">
                  <td className="p-4 font-fa">{c.name_fa}</td>
                  <td className="p-4">{c.name_en}</td>
                  <td className="p-4 text-text-muted">{c.slug}</td>
                  <td className="p-4">{c._count?.products ?? 0}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="text-primary hover:underline" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setConfirm(c)} className="text-red-500 hover:underline" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Collection' : 'Add Collection'}>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {error && <p className="text-caption text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Persian Name" value={form.name_fa} onChange={(e) => set('name_fa', e.target.value)} />
            <Input
              label="English Name"
              value={form.name_en}
              onChange={(e) => {
                const v = e.target.value;
                set('name_en', v);
                if (!editing && !form.slug) set('slug', slugify(v));
              }}
            />
          </div>
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => set('slug', slugify(e.target.value))}
            placeholder="my-collection"
          />
          <div className="grid grid-cols-2 gap-4">
            <Textarea label="Persian Description" value={form.description_fa} onChange={(e) => set('description_fa', e.target.value)} />
            <Textarea label="English Description" value={form.description_en} onChange={(e) => set('description_en', e.target.value)} />
          </div>
          <ImageUpload label="Cover Image" value={form.coverImage} onChange={(url) => set('coverImage', url)} />
          <Input
            label="Sort Order"
            type="number"
            value={String(form.sortOrder)}
            onChange={(e) => set('sortOrder', Number(e.target.value) || 0)}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title="Delete Collection"
        message="آیا مطمئنید؟ این عمل غیرقابل بازگشت است."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

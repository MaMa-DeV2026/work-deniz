'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminGet, adminSend } from '@/lib/admin-api';

type Collection = { id: string; name_en: string };
type Product = {
  id: string;
  name_fa: string;
  name_en: string;
  collectionId: string;
  collection?: { name_en: string };
  material: string;
  movement: string;
  waterResistance: string;
  caseDiameter: string;
  description_fa: string;
  description_en: string;
  images: string[];
  rating: number;
  sortOrder: number;
};

const MATERIALS = ['Steel', 'Titanium', 'Ceramic'];
const MOVEMENTS = ['Automatic', 'Quartz', 'Mechanical'];
const WATERS = ['100m', '300m'];
const DIAMETERS = ['40mm', '42mm'];

type Form = {
  name_fa: string;
  name_en: string;
  collectionId: string;
  material: string;
  movement: string;
  waterResistance: string;
  caseDiameter: string;
  description_fa: string;
  description_en: string;
  images: string[];
  rating: number;
  sortOrder: number;
};

const EMPTY: Form = {
  name_fa: '',
  name_en: '',
  collectionId: '',
  material: 'Steel',
  movement: 'Automatic',
  waterResistance: '100m',
  caseDiameter: '40mm',
  description_fa: '',
  description_en: '',
  images: ['', '', '', '', ''],
  rating: 5,
  sortOrder: 0,
};

export default function ProductsManager() {
  const [items, setItems] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [cols, data] = await Promise.all([
        adminGet<{ collections: Collection[] }>('/api/admin/collections'),
        adminGet<{ products: Product[] }>(`/api/admin/products${filter ? `?collectionId=${filter}` : ''}`),
      ]);
      setCollections(cols.collections);
      setItems(data.products);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY, collectionId: collections[0]?.id ?? '' });
    setError('');
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name_fa: p.name_fa,
      name_en: p.name_en,
      collectionId: p.collectionId,
      material: p.material,
      movement: p.movement,
      waterResistance: p.waterResistance,
      caseDiameter: p.caseDiameter,
      description_fa: p.description_fa,
      description_en: p.description_en,
      images: [...p.images, '', '', '', '', ''].slice(0, 5),
      rating: p.rating,
      sortOrder: p.sortOrder,
    });
    setError('');
    setModalOpen(true);
  }

  function set<K extends keyof Form>(field: K, value: Form[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setImage(index: number, url: string) {
    setForm((f) => {
      const images = [...f.images];
      images[index] = url;
      return { ...f, images };
    });
  }

  async function save() {
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      images: form.images.filter((i) => i.trim() !== ''),
      sortOrder: Number(form.sortOrder) || 0,
      rating: Number(form.rating) || 0,
    };
    try {
      if (editing) {
        await adminSend('/api/admin/products', 'PUT', { id: editing.id, ...payload });
      } else {
        await adminSend('/api/admin/products', 'POST', payload);
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
      await adminSend('/api/admin/products', 'DELETE', { id: confirm.id });
      setConfirm(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  const selectClass =
    'w-full rounded-lg border border-accent bg-white px-4 py-3 text-body-sm text-text-dark outline-none focus:border-primary';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-display-md font-semibold text-primary">Manage Products</h1>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={selectClass}>
            <option value="">All Collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </select>
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-accent/60 bg-white">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-accent/60 bg-surface text-text-muted">
            <tr>
              <th className="p-4">Persian Name</th>
              <th className="p-4">English Name</th>
              <th className="p-4">Collection</th>
              <th className="p-4">Material</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-muted">
                  <Loader2 className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-muted">
                  No products found.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-b border-accent/40">
                  <td className="p-4 font-fa">{p.name_fa}</td>
                  <td className="p-4">{p.name_en}</td>
                  <td className="p-4 text-text-muted">{p.collection?.name_en}</td>
                  <td className="p-4">{p.material}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1">
                      <Star size={14} className="text-primary" /> {p.rating}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-primary hover:underline" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setConfirm(p)} className="text-red-500 hover:underline" title="Delete">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          {error && <p className="text-caption text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Persian Name" value={form.name_fa} onChange={(e) => set('name_fa', e.target.value)} />
            <Input label="English Name" value={form.name_en} onChange={(e) => set('name_en', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-dark">Collection</label>
              <select value={form.collectionId} onChange={(e) => set('collectionId', e.target.value)} className={selectClass}>
                <option value="">Select collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Sort Order"
              type="number"
              value={String(form.sortOrder)}
              onChange={(e) => set('sortOrder', Number(e.target.value) || 0)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-dark">Material</label>
              <select value={form.material} onChange={(e) => set('material', e.target.value)} className={selectClass}>
                {MATERIALS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-dark">Movement</label>
              <select value={form.movement} onChange={(e) => set('movement', e.target.value)} className={selectClass}>
                {MOVEMENTS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-dark">Water Resistance</label>
              <select value={form.waterResistance} onChange={(e) => set('waterResistance', e.target.value)} className={selectClass}>
                {WATERS.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-dark">Case Diameter</label>
              <select value={form.caseDiameter} onChange={(e) => set('caseDiameter', e.target.value)} className={selectClass}>
                {DIAMETERS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-body-sm font-medium text-text-dark">Images (up to 5)</label>
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {form.images.map((img, i) => (
                <ImageUpload key={i} value={img} onChange={(url) => setImage(i, url)} separated={!!editing} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-sm font-medium text-text-dark">
              Rating: <span className="text-primary">{form.rating}</span>
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={form.rating}
              onChange={(e) => set('rating', Number(e.target.value))}
              className="w-full accent-[#1B3A5C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Textarea label="Persian Description" value={form.description_fa} onChange={(e) => set('description_fa', e.target.value)} />
            <Textarea label="English Description" value={form.description_en} onChange={(e) => set('description_en', e.target.value)} />
          </div>
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
        title="Delete Product"
        message="آیا مطمئنید؟ این عمل غیرقابل بازگشت است."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

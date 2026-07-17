'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ImageUpload from '@/components/admin/ImageUpload';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { adminGet, adminSend } from '@/lib/admin-api';
import { slugify } from '@/lib/utils';

type Post = {
  id: string;
  title_fa: string;
  title_en: string;
  slug: string;
  excerpt_fa: string;
  excerpt_en: string;
  content_fa: string;
  content_en: string;
  coverImage: string;
  author: string;
  published: boolean;
  readTime: number;
};

type Form = {
  title_fa: string;
  title_en: string;
  slug: string;
  excerpt_fa: string;
  excerpt_en: string;
  content_fa: string;
  content_en: string;
  coverImage: string;
  author: string;
  published: boolean;
  readTime: number;
};

const EMPTY: Form = {
  title_fa: '',
  title_en: '',
  slug: '',
  excerpt_fa: '',
  excerpt_en: '',
  content_fa: '',
  content_en: '',
  coverImage: '',
  author: 'رضا احمدی',
  published: false,
  readTime: 5,
};

export default function BlogManager() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [tab, setTab] = useState<'fa' | 'en'>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      const data = await adminGet<{ posts: Post[] }>('/api/admin/blog');
      setItems(data.posts);
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
    setTab('en');
    setError('');
    setModalOpen(true);
  }

  function openEdit(p: Post) {
    setEditing(p);
    setForm({
      title_fa: p.title_fa,
      title_en: p.title_en,
      slug: p.slug,
      excerpt_fa: p.excerpt_fa,
      excerpt_en: p.excerpt_en,
      content_fa: p.content_fa,
      content_en: p.content_en,
      coverImage: p.coverImage,
      author: p.author,
      published: p.published,
      readTime: p.readTime,
    });
    setTab('en');
    setError('');
    setModalOpen(true);
  }

  function set<K extends keyof Form>(field: K, value: Form[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await adminSend('/api/admin/blog', 'PUT', { id: editing.id, ...form });
      } else {
        await adminSend('/api/admin/blog', 'POST', form);
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
      await adminSend('/api/admin/blog', 'DELETE', { id: confirm.id });
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
        <h1 className="font-display text-display-md font-semibold text-primary">Manage Blog</h1>
        <Button onClick={openAdd}>
          <Plus size={16} /> Add Post
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-accent/60 bg-white">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-accent/60 bg-surface text-text-muted">
            <tr>
              <th className="p-4">Persian Title</th>
              <th className="p-4">English Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Published</th>
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
                  No posts found.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-b border-accent/40">
                  <td className="p-4 font-fa">{p.title_fa}</td>
                  <td className="p-4">{p.title_en}</td>
                  <td className="p-4 text-text-muted">{p.slug}</td>
                  <td className="p-4">
                    {p.published ? (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-caption text-primary">Published</span>
                    ) : (
                      <span className="rounded-full bg-surface px-3 py-1 text-caption text-text-muted">Draft</span>
                    )}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Post' : 'Add Post'}>
        <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
          {error && <p className="text-caption text-red-500">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <Input label="Persian Title" value={form.title_fa} onChange={(e) => set('title_fa', e.target.value)} />
            <Input
              label="English Title"
              value={form.title_en}
              onChange={(e) => {
                const v = e.target.value;
                set('title_en', v);
                if (!editing && !form.slug) set('slug', slugify(v));
              }}
            />
          </div>
          <Input
            label="Slug"
            value={form.slug}
            onChange={(e) => set('slug', slugify(e.target.value))}
            placeholder="my-post"
          />
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload label="Cover Image" value={form.coverImage} onChange={(url) => set('coverImage', url)} />
            <div className="flex flex-col gap-4">
              <Input
                label="Read Time (min)"
                type="number"
                value={String(form.readTime)}
                onChange={(e) => set('readTime', Number(e.target.value) || 5)}
              />
              <Input label="Author" value={form.author} onChange={(e) => set('author', e.target.value)} />
              <label className="flex items-center gap-2 text-body-sm text-text-dark">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set('published', e.target.checked)}
                  className="h-4 w-4 accent-[#1B3A5C]"
                />
                Published
              </label>
            </div>
          </div>

          <div className="flex gap-1 rounded-lg bg-surface p-1">
            <button
              type="button"
              onClick={() => setTab('fa')}
              className={`flex-1 rounded-md py-2 text-body-sm transition-colors ${
                tab === 'fa' ? 'bg-white text-primary shadow-sm' : 'text-text-muted'
              }`}
            >
              فارسی (Persian)
            </button>
            <button
              type="button"
              onClick={() => setTab('en')}
              className={`flex-1 rounded-md py-2 text-body-sm transition-colors ${
                tab === 'en' ? 'bg-white text-primary shadow-sm' : 'text-text-muted'
              }`}
            >
              English
            </button>
          </div>

          {tab === 'en' ? (
            <div className="space-y-4">
              <Textarea label="English Excerpt" value={form.excerpt_en} onChange={(e) => set('excerpt_en', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-body-sm font-medium text-text-dark">English Content</label>
                <RichTextEditor key="en" value={form.content_en} onChange={(html) => set('content_en', html)} placeholder="Write the English article…" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea label="Persian Excerpt" value={form.excerpt_fa} onChange={(e) => set('excerpt_fa', e.target.value)} />
              <div className="flex flex-col gap-1.5">
                <label className="text-body-sm font-medium text-text-dark">Persian Content</label>
                <RichTextEditor key="fa" value={form.content_fa} onChange={(html) => set('content_fa', html)} placeholder="متن فارسی مقاله را بنویسید…" />
              </div>
            </div>
          )}
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
        title="Delete Post"
        message="آیا مطمئنید؟ این عمل غیرقابل بازگشت است."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

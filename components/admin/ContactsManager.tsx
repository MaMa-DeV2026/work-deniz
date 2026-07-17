'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, MailOpen, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { adminGet, adminSend } from '@/lib/admin-api';
import { formatDate } from '@/lib/utils';

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function ContactsManager() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      const data = await adminGet<{ contacts: Contact[] }>('/api/admin/contacts');
      setItems(data.contacts);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(c: Contact) {
    try {
      const { contact } = await adminSend<{ contact: Contact }>('/api/admin/contacts', 'PATCH', {
        id: c.id,
        read: !c.read,
      });
      setItems((list) => list.map((x) => (x.id === c.id ? contact : x)));
      setSelected(contact);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function confirmDelete() {
    if (!confirm) return;
    setDeleting(true);
    try {
      await adminSend('/api/admin/contacts', 'DELETE', { id: confirm.id });
      setItems((list) => list.filter((x) => x.id !== confirm.id));
      setSelected(null);
      setConfirm(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  function openRow(c: Contact) {
    setSelected(c);
  }

  return (
    <div>
      <h1 className="font-display text-display-md font-semibold text-primary">Contact Messages</h1>

      <div className="mt-8 overflow-x-auto rounded-xl border border-accent/60 bg-white">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-accent/60 bg-surface text-text-muted">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
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
                  No messages yet.
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openRow(c)}
                  className="cursor-pointer border-b border-accent/40 transition-colors hover:bg-surface"
                >
                  <td className="p-4 font-medium text-text-dark">{c.name}</td>
                  <td className="p-4 text-text-muted">{c.email}</td>
                  <td className="p-4">{c.subject}</td>
                  <td className="p-4 text-text-muted">{formatDate(c.createdAt, 'en')}</td>
                  <td className="p-4">
                    {c.read ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-caption text-text-muted">
                        <MailOpen size={12} /> Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-caption text-primary">
                        <Mail size={12} /> Unread
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="mt-3 text-caption text-red-500">{error}</p>}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-accent/60 px-6 py-4">
              <h2 className="font-display text-lg font-semibold text-primary">Message</h2>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text-dark">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div>
                <p className="text-caption text-text-muted">From</p>
                <p className="text-body font-medium text-text-dark">{selected.name}</p>
                <a href={`mailto:${selected.email}`} className="text-body-sm text-primary hover:underline">
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-caption text-text-muted">Subject</p>
                <p className="text-body text-text-dark">{selected.subject}</p>
              </div>
              <div>
                <p className="text-caption text-text-muted">Date</p>
                <p className="text-body-sm text-text-dark">{formatDate(selected.createdAt, 'en')}</p>
              </div>
              <div>
                <p className="text-caption text-text-muted">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-body-sm leading-relaxed text-text-dark">
                  {selected.message}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-accent/60 px-6 py-4">
              <button
                onClick={() => toggleRead(selected)}
                className="inline-flex items-center gap-2 text-body-sm text-primary hover:underline"
              >
                {selected.read ? <Mail size={16} /> : <MailOpen size={16} />}
                {selected.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>
              <button
                onClick={() => setConfirm(selected)}
                className="inline-flex items-center gap-1 text-body-sm text-red-500 hover:underline"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

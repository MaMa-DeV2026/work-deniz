'use client';

import { useEffect, useState } from 'react';
import { Loader2, X, Download, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { adminGet, adminSend } from '@/lib/admin-api';

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  resumeUrl?: string | null;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Under Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-primary/10 text-primary',
  reviewed: 'bg-amber-100 text-amber-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function CareersManager() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await adminGet<{ applications: Application[] }>('/api/admin/careers');
      setItems(data.applications);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(a: Application, status: string) {
    try {
      const { application } = await adminSend<{ application: Application }>('/api/admin/careers', 'PATCH', {
        id: a.id,
        status,
      });
      setItems((list) => list.map((x) => (x.id === a.id ? application : x)));
      setSelected(application);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <h1 className="font-display text-display-md font-semibold text-primary">Career Applications</h1>

      <div className="mt-8 overflow-x-auto rounded-xl border border-accent/60 bg-white">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-accent/60 bg-surface text-text-muted">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Position</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted">
                  <Loader2 className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted">
                  No applications yet.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="cursor-pointer border-b border-accent/40 transition-colors hover:bg-surface"
                >
                  <td className="p-4 font-medium text-text-dark">{a.name}</td>
                  <td className="p-4 text-text-muted">{a.position}</td>
                  <td className="p-4 text-text-muted">{formatDate(a.createdAt, 'en')}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-caption ${STATUS_STYLES[a.status] ?? 'bg-surface text-text-muted'}`}>
                      {STATUS_OPTIONS.find((s) => s.value === a.status)?.label ?? a.status}
                    </span>
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
              <h2 className="font-display text-lg font-semibold text-primary">Application</h2>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text-dark">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div>
                <p className="text-caption text-text-muted">Name</p>
                <p className="text-body font-medium text-text-dark">{selected.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-caption text-text-muted">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-body-sm text-primary hover:underline">
                    {selected.email}
                  </a>
                </div>
                <div>
                  <p className="text-caption text-text-muted">Phone</p>
                  <p className="text-body-sm text-text-dark">{selected.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-caption text-text-muted">Position</p>
                <p className="text-body text-text-dark">{selected.position}</p>
              </div>
              <div>
                <p className="text-caption text-text-muted">Cover Letter</p>
                <p className="mt-1 whitespace-pre-wrap text-body-sm leading-relaxed text-text-dark">
                  {selected.message}
                </p>
              </div>
              {selected.resumeUrl && (
                <a
                  href={selected.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2 text-body-sm text-primary hover:bg-primary hover:text-white"
                >
                  <Download size={16} /> Download Resume
                </a>
              )}
              <div>
                <p className="text-caption text-text-muted">Received</p>
                <p className="text-body-sm text-text-dark">{formatDate(selected.createdAt, 'en')}</p>
              </div>
            </div>
            <div className="border-t border-accent/60 px-6 py-4">
              <label className="text-body-sm font-medium text-text-dark">Status</label>
              <select
                value={selected.status}
                onChange={(e) => changeStatus(selected, e.target.value)}
                className="mt-2 w-full rounded-lg border border-accent bg-white px-4 py-3 text-body-sm text-text-dark outline-none focus:border-primary"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FileText, Mail, Briefcase } from 'lucide-react';
import { adminGet } from '@/lib/admin-api';
import { formatDate } from '@/lib/utils';

type Stats = { products: number; posts: number; unread: number; applications: number };
type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  read: boolean;
  createdAt: string;
};
type Application = {
  id: string;
  name: string;
  position: string;
  status: string;
  createdAt: string;
};

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [careers, setCareers] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGet<{ stats: Stats; contacts: Contact[]; careers: Application[] }>('/api/admin/dashboard')
      .then((d) => {
        setStats(d.stats);
        setContacts(d.contacts);
        setCareers(d.careers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { key: 'products', label: 'Total Products', value: stats?.products, icon: Package, href: '/admin/products' },
    { key: 'posts', label: 'Blog Posts', value: stats?.posts, icon: FileText, href: '/admin/blog' },
    { key: 'unread', label: 'New Messages', value: stats?.unread, icon: Mail, href: '/admin/contacts' },
    { key: 'applications', label: 'Applications', value: stats?.applications, icon: Briefcase, href: '/admin/careers' },
  ];

  return (
    <div>
      <h1 className="font-display text-display-md font-semibold text-primary">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="group rounded-xl border border-accent/60 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-text-muted">{c.label}</span>
                <Icon size={18} className="text-primary/70" />
              </div>
              <p className="mt-3 font-display text-display-sm font-semibold text-primary">
                {loading ? '—' : c.value}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-accent/60 bg-white">
          <div className="flex items-center justify-between border-b border-accent/60 px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-primary">Recent Contacts</h2>
            <Link href="/admin/contacts" className="text-caption text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-accent/40">
            {contacts.length === 0 && <p className="px-5 py-6 text-body-sm text-text-muted">No contacts yet.</p>}
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-body-sm font-medium text-text-dark">{c.name}</p>
                  <p className="truncate text-caption text-text-muted">{c.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  {!c.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  <span className="text-caption text-text-muted">
                    {formatDate(c.createdAt, 'en')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-accent/60 bg-white">
          <div className="flex items-center justify-between border-b border-accent/60 px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-primary">Recent Applications</h2>
            <Link href="/admin/careers" className="text-caption text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-accent/40">
            {careers.length === 0 && (
              <p className="px-5 py-6 text-body-sm text-text-muted">No applications yet.</p>
            )}
            {careers.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-body-sm font-medium text-text-dark">{a.name}</p>
                  <p className="truncate text-caption text-text-muted">{a.position}</p>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-caption capitalize text-text-muted">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

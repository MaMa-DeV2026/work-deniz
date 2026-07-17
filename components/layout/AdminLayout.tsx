'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Watch,
  FileText,
  Mail,
  Briefcase,
  MapPin,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'collections', label: 'Collections', href: '/admin/collections', icon: Layers },
  { key: 'products', label: 'Products', href: '/admin/products', icon: Watch },
  { key: 'blog', label: 'Blog', href: '/admin/blog', icon: FileText },
  { key: 'contacts', label: 'Contacts', href: '/admin/contacts', icon: Mail },
  { key: 'careers', label: 'Careers', href: '/admin/careers', icon: Briefcase },
  { key: 'locations', label: 'Locations', href: '/admin/locations', icon: MapPin },
];

const BOTTOM_TABS = ['dashboard', 'products', 'blog', 'contacts'];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <div className="flex h-full flex-col bg-[#1A1A1A] text-white">
      <div className="flex items-center gap-2 px-5 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
        <div className="-ml-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm">
  <span className="font-display text-3xl font-light tracking-[0.08em] text-white">
    D
  </span>
</div>
</div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                'justify-center lg:justify-start',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:text-white justify-center lg:justify-start"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-screen w-16 shrink-0 md:block lg:w-60">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-60 shadow-xl">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-accent/60 bg-white px-4 md:hidden">
       <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5">
  <span className="font-display text-3xl font-semibold tracking-wide text-white">
    D
  </span>
</div>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      <main className="flex-1 overflow-y-auto bg-surface p-5 pt-20 pb-24 md:p-8 md:pt-8 md:pb-8 lg:p-10">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-accent/60 bg-white md:hidden">
        {NAV.filter((item) => BOTTOM_TABS.includes(item.key)).map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors',
                active ? 'text-primary' : 'text-text-muted'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

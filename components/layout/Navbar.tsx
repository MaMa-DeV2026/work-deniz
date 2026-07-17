'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { locales } from '@/lib/i18n';

const navItems = [
  { key: 'home', href: '' },
 
  { key: 'about', href: '/about' },
  { key: 'blog', href: '/blog' },
  { key: 'warranty', href: '/warranty' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Navbar() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const switchLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
    setOpen(false);
  };

  const isActive = (href: string) =>
    href === ''
      ? pathname === `/${locale}`
      : pathname.startsWith(`/${locale}/${href}`);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-accent bg-white transition-shadow duration-[350ms]',
        open && 'shadow-sm'
      )}
    >
      <div className="container-luxury flex h-[58px] items-center justify-between">
        <Link
          href={`/${locale}`}
          className="font-display text-[22px] font-semibold tracking-[0.3em] text-primary"
        >
          DENIZ
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={cn(
                  'relative text-[12px] uppercase tracking-[0.12em] transition-colors duration-200',
                  active ? 'text-primary' : 'text-text-dark hover:text-primary'
                )}
              >
                {t(item.key)}
                {active && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1 lg:flex">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                aria-pressed={l === locale}
                className={cn(
                  'rounded-xl px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors duration-200',
                  l === locale
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:text-primary'
                )}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-[22px] w-[22px]">
              <span
                className="absolute left-0 top-[4px] block h-0.5 w-[22px] bg-text-dark"
                style={{
                  transform: open ? 'translateY(7px) rotate(45deg)' : 'translateY(0) rotate(0deg)',
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              />
              <span
                className="absolute left-0 top-[10px] block h-0.5 w-[22px] bg-text-dark"
                style={{
                  opacity: open ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              />
              <span
                className="absolute left-0 top-[16px] block h-0.5 w-[22px] bg-text-dark"
                style={{
                  transform: open ? 'translateY(-7px) rotate(-45deg)' : 'translateY(0) rotate(0deg)',
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex w-full flex-col overflow-x-hidden bg-white lg:hidden">
          <div className="container-luxury flex h-[58px] items-center justify-between">
            <span className="font-display text-[22px] font-semibold tracking-[0.3em] text-primary">
              DENIZ
            </span>
            <button
              className="flex h-11 w-11 items-center justify-center"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <span className="relative block h-[22px] w-[22px]">
                <span className="absolute left-0 top-[10px] block h-0.5 w-[22px] rotate-45 bg-text-dark" />
                <span className="absolute left-0 top-[10px] block h-0.5 w-[22px] -rotate-45 bg-text-dark" />
              </span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-2 overflow-y-auto px-4 md:gap-4">
            {navItems.map((item) => (
              <div key={item.key}>
                <Link
                  href={`/${locale}${item.href}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex min-h-[48px] items-center font-display text-[28px] transition-colors md:text-[36px]',
                    isActive(item.href) ? 'text-primary' : 'text-text-dark'
                  )}
                >
                  {t(item.key)}
                </Link>
              </div>
            ))}
          </nav>

          <div className="container-luxury flex shrink-0 items-center justify-center gap-2 pb-12">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={cn(
                  'min-h-[44px] min-w-[44px] rounded-xl px-5 py-2 text-[13px] font-medium uppercase tracking-wider transition-colors',
                  l === locale
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted'
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

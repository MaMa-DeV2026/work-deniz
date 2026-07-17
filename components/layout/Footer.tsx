import Link from 'next/link';
import { getLocale } from 'next-intl/server';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21H9z" />
    </svg>
  );
}

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 17.9a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
    </svg>
  );
}

/**
 * High-fidelity layered sea-wave divider, anchored to the footer's top edge.
 * Stacking (back -> front): white foam (highest crest) ... navy base (lowest
 * crest, drawn last) so the navy blends seamlessly into the footer behind it.
 * The wrapper is centered on the footer top edge (overflows up into the page
 * and down into the footer) — zero gap. Pure SVG + CSS, no assets.
 */
function SeaWaves() {
  return (
    <>
      <style>{`
        @keyframes seaA { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-14px, -5px); } }
        @keyframes seaB { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(16px, 4px); } }
        @keyframes seaC { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-10px, 6px); } }
        @keyframes seaD { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(12px, -4px); } }
        @keyframes seaE { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-7px, 3px); } }
        .sea-layer { transform-box: fill-box; transform-origin: center; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .sea-layer { animation: none !important; } }
      `}</style>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 -translate-y-1/2 leading-[0]">
        <svg
          className="block w-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          role="presentation"
        >
          <defs>
            <filter id="seaFoamBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
          </defs>

          {/* Back layer — near-white foam (highest crest) */}
          <path
            className="sea-layer"
            style={{ animation: 'seaE 11s ease-in-out infinite alternate', filter: 'url(#seaFoamBlur)' }}
            fill="#FFFFFF"
            fillOpacity="0.92"
            d="M-40,30 C240,52 500,8 740,28 C980,58 1200,10 1480,26 L1480,120 L-40,120 Z"
          />
          {/* #9FB4C9 */}
          <path
            className="sea-layer"
            style={{ animation: 'seaD 13s ease-in-out infinite alternate' }}
            fill="#9FB4C9"
            fillOpacity="0.8"
            d="M-40,46 C300,22 520,64 760,40 C1000,14 1220,60 1480,38 L1480,120 L-40,120 Z"
          />
          {/* #5E7C9C */}
          <path
            className="sea-layer"
            style={{ animation: 'seaC 10s ease-in-out infinite alternate' }}
            fill="#5E7C9C"
            fillOpacity="0.85"
            d="M-40,64 C220,86 480,42 700,60 C960,86 1180,40 1480,56 L1480,120 L-40,120 Z"
          />
          {/* #36557A */}
          <path
            className="sea-layer"
            style={{ animation: 'seaB 14s ease-in-out infinite alternate' }}
            fill="#36557A"
            fillOpacity="0.95"
            d="M-40,84 C260,62 480,98 720,76 C980,52 1200,94 1480,72 L1480,120 L-40,120 Z"
          />
          {/* Front layer — base navy (#1B3A5C), lowest crest, blends into footer */}
          <path
            className="sea-layer"
            style={{ animation: 'seaA 12s ease-in-out infinite alternate' }}
            fill="#1B3A5C"
            fillOpacity="1"
            d="M-40,104 C220,82 440,112 700,94 C960,72 1180,108 1480,92 L1480,120 L-40,120 Z"
          />
        </svg>
      </div>
    </>
  );
}

export default async function Footer() {
  const locale = await getLocale();
  const isFa = locale === 'fa';

  const quickLinks = [
    { label: isFa ? 'کالکشن‌ها' : 'Collection', href: `/${locale}/collection` },
    { label: isFa ? 'درباره ما' : 'About', href: `/${locale}/about` },
    { label: isFa ? 'وبلاگ' : 'Blog', href: `/${locale}/blog` },
    { label: isFa ? 'گارانتی' : 'Warranty', href: `/${locale}/warranty` },
    { label: isFa ? 'فرصت‌های شغلی' : 'Careers', href: `/${locale}/careers` },
    { label: isFa ? 'تماس با ما' : 'Contact', href: `/${locale}/contact` },
  ];

  const socials = [
    { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
    { Icon: LinkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
    { Icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com' },
  ];

  return (
    <footer className="relative isolate bg-[#1B3A5C] text-white">
      <SeaWaves />

      {/* Main content — compact 3-column layout */}
      <div className="container-luxury relative z-10 grid gap-3 py-3 text-center animate-slide-up md:grid-cols-2 md:gap-4 md:py-4 md:text-left lg:grid-cols-3">
        {/* Contact — left */}
        <div className="flex flex-col items-center md:items-start mt-10">
          <h4 className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            {isFa ? 'تماس با ما' : 'Contact'}
          </h4>
          <ul className="mt-3 space-y-0.5 text-[12px] text-white/60 md:space-y-1">
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="text-[11px]">📍</span>
              <span>{isFa ? 'یزد، ایران' : 'Yazd, Iran'}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="text-[11px]">📞</span>
              <span dir="ltr">+98 35 1234 5678</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="text-[11px]">✉️</span>
              <span dir="ltr">hello@denizwatch.com</span>
            </li>
          </ul>
        </div>

        {/* Navigation — middle */}
        <div className="flex flex-col items-center md:items-start md:translate-y-[10%] lg:translate-y-[20%]">
          <h4 className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            {isFa ? 'صفحات' : 'Pages'}
          </h4>
          <ul className="mt-3 space-y-0.5 md:space-y-1">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block text-[12px] text-white/60 transition-colors hover:text-white/90"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand — right */}
        <div className="flex flex-col items-center md:items-start">
          <p className="font-display text-[24px] font-semibold tracking-[0.18em] text-white">
            DENIZ
          </p>
          <p className="mt-2 font-display text-[13px] italic text-white/45">
            {isFa ? 'هنرِ زمان' : 'The Art of Time'}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.08]">
        <div className="container-luxury flex flex-col items-center gap-2 py-3 text-center text-[10px] text-white/30 md:flex-row md:justify-between md:text-left">
          <span>© 2025 DENIZ Watch Company</span>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link href={`/${locale}/warranty`} className="transition-colors hover:text-white/50">
              {isFa ? 'حریم خصوصی' : 'Privacy Policy'}
            </Link>
            <Link href={`/${locale}/warranty`} className="transition-colors hover:text-white/50">
              {isFa ? 'شرایط خدمات' : 'Terms of Service'}
            </Link>
            <span className="hidden text-white/15 md:inline">·</span>
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/45 transition-colors hover:text-white/80"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

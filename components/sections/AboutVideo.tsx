'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

export default function AboutVideo() {
  const locale = useLocale();
  const isFa = locale === 'fa';
  const [open, setOpen] = useState(false);

  const msg = isFa
    ? 'ویدیوی معرفی برند به زودی اضافه می‌شود'
    : 'Brand introduction video coming soon';

  return (
    <section className="bg-primary py-16 md:py-24">
      <div className="container-luxury">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block h-[min(420px,60vw)] w-full overflow-hidden rounded-sm"
          aria-label="Play brand video"
        >
          <Image
            src="/images/placeholder/about-video.svg"
            alt="DENIZ brand"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-primary/40" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-primary" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <p className="text-center font-display text-[24px] text-primary">{msg}</p>
      </Modal>
    </section>
  );
}

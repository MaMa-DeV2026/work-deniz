'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  collection: string;
  collectionId: string;
  material: string;
  specs: string;
  rating: number;
  image: string;
};

type Collection = { id: string; name: string };

const MATERIALS = ['Steel', 'Titanium', 'Ceramic'];

export default function CollectionView({
  locale,
  products,
  collections,
}: {
  locale: string;
  products: Product[];
  collections: Collection[];
}) {
  const isFa = locale === 'fa';
  const reduce = useReducedMotion();
  const [coll, setColl] = useState('all');
  const [mat, setMat] = useState('all');

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (coll === 'all' || p.collectionId === coll) &&
          (mat === 'all' || p.material === mat)
      ),
    [products, coll, mat]
  );

  const pill = (active: boolean) =>
    cn(
      'rounded-xl border px-5 py-2 text-[13px] transition-all duration-200',
      active
        ? 'border-primary bg-primary text-white'
        : 'border-accent bg-transparent text-text-muted hover:border-primary hover:text-primary'
    );

  const pillSm = (active: boolean) =>
    cn(
      'rounded-xl border px-4 py-1.5 text-[11px] uppercase tracking-[0.05em] transition-all duration-200',
      active
        ? 'border-primary bg-primary text-white'
        : 'border-accent bg-transparent text-text-muted hover:border-primary hover:text-primary'
    );

  return (
    <>
      <div className="sticky top-[58px] z-40 border-b border-accent bg-white">
        <div className="container-luxury flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button className={pill(coll === 'all')} onClick={() => setColl('all')}>
              {isFa ? 'همه' : 'All'}
            </button>
            {collections.map((c) => (
              <button key={c.id} className={pill(coll === c.id)} onClick={() => setColl(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={pillSm(mat === 'all')} onClick={() => setMat('all')}>
              {isFa ? 'همه' : 'All'}
            </button>
            {MATERIALS.map((m) => (
              <button key={m} className={pillSm(mat === m)} onClick={() => setMat(m)}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-luxury px-8 py-16">
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.05, ease: EASE_LUXURY }}
                className="group"
              >
                <div className="rounded-sm transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.25,1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(27,58,92,0.08)]">
                <Link href={`/${locale}/product/${p.id}`} className="block">
                  <div className="relative aspect-square w-full overflow-hidden bg-surface">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-secondary">{p.collection}</p>
                  <h3 className="mt-1 font-display text-[22px] text-text-dark">{p.name}</h3>
                  <div className="mt-2 flex text-secondary">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-[14px] leading-none">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[12px] text-text-muted">{p.specs}</p>
                </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

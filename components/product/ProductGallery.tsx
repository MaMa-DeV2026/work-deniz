'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const safe = images.length ? images : [''];
  const go = (i: number) => setActive(((i % safe.length) + safe.length) % safe.length);

  return (
    <div>
      <motion.div
        className="relative aspect-square w-full overflow-hidden bg-surface"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          const offsetOk = Math.abs(info.offset.x) > 50;
          const velocityOk = Math.abs(info.velocity.x) > 200;
          if (offsetOk || velocityOk) {
            if (info.offset.x < 0) go(active + 1);
            else go(active - 1);
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={safe[active]}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[600ms] hover:scale-[1.02]"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Desktop: thumbnail grid */}
      <div className="mt-4 hidden gap-3 md:flex">
        {safe.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative h-20 w-20 overflow-hidden rounded-sm',
              i === active ? 'border-2 border-primary' : 'border border-accent'
            )}
          >
            <Image src={img} alt={name} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>

      {/* Mobile: horizontal scroll thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 md:hidden">
        {safe.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-sm',
              i === active ? 'border-2 border-primary' : 'border border-accent'
            )}
          >
            <Image src={img} alt={name} fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>

      {/* Mobile: dot indicators */}
      <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
        {safe.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => setActive(i)}
            className="flex items-center justify-center"
          >
            <span
              className={cn(
                'block rounded-full transition-all duration-300',
                i === active ? 'h-2 w-2 bg-primary' : 'h-1.5 w-1.5 bg-accent-dark'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { EASE_LUXURY } from '@/lib/motion';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.4, ease: EASE_LUXURY } }}
        exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: reduce ? 0 : 0.25, ease: EASE_LUXURY } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
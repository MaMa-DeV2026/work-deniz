'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { EASE_LUXURY, DURATION_BASE } from '@/lib/motion';

type Direction = 'up' | 'left' | 'right' | 'none';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  /** travel distance in px for the chosen direction (default 24) */
  distance?: number;
  /** animation duration in seconds (default DURATION_BASE) */
  duration?: number;
};

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
  distance = 24,
  duration = DURATION_BASE,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();

  const o =
    direction === 'left'
      ? { x: -distance, y: 0 }
      : direction === 'right'
        ? { x: distance, y: 0 }
        : direction === 'up'
          ? { x: 0, y: distance }
          : { x: 0, y: 0 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: reduce ? 0 : o.x, y: reduce ? 0 : o.y }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: reduce ? 0 : o.x, y: reduce ? 0 : o.y }
      }
      transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: EASE_LUXURY }}
    >
      {children}
    </motion.div>
  );
}

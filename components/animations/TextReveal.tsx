'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { EASE_OUT_LUXURY } from '@/lib/motion';

type TextRevealProps = {
  /** USE ONLY IN HERO */
  text?: string;
  children?: ReactNode;
  delay?: number;
  className?: string;
};

export default function TextReveal({
  text,
  children,
  delay = 0,
  className,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  const content = text ?? (typeof children === 'string' ? children : '');
  const words = content.split(' ');

  if (reduce) {
    return (
      <span ref={ref} className={className}>
        {content}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} aria-label={content}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={inView ? { y: '0%' } : { y: '100%' }}
            transition={{ duration: 0.5, delay: delay + i * 0.08, ease: EASE_OUT_LUXURY }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ReactNode, useRef } from 'react';

type ParallaxWrapperProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

/**
 * ONLY FOR hero background images.
 * Provides a gentle vertical parallax driven by scroll position.
 * Max parallax offset is clamped to 60px so motion stays subtle ("silk", not rubber).
 */
export default function ParallaxWrapper({
  children,
  speed = 0.3,
  className,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [0, -speed * 100]);
  const y = useTransform(raw, (v) => Math.max(-60, Math.min(60, v)));

  return (
    <div ref={ref} className={className}>
      <motion.div className="relative h-full w-full" style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
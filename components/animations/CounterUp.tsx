'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

type CounterUpProps = {
  target: number;
  /** @deprecated use `target` */
  to?: number;
  suffix?: string;
  duration?: number;
  className?: string;
  /** accepted for backward compatibility, currently unused */
  locale?: 'fa' | 'en';
};

export default function CounterUp({
  target,
  to,
  suffix = '',
  duration = 1.5,
  className,
}: CounterUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  const goal = target ?? to ?? 0;

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(goal);
      return;
    }
    const controls = animate(0, goal, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, goal, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
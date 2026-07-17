'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
};

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function StarRating({ value, max = 5, size = 'md', className, showValue = false }: StarRatingProps) {
  const reduce = useReducedMotion();
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className={cn('inline-flex text-secondary-dark', sizeMap[size])} aria-hidden>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < full;
          const half = i === full && hasHalf;
          return (
            <span key={i} className="relative inline-block leading-none">
              <span className="text-accent-dark">★</span>
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden text-primary"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  ★
                </span>
              )}
            </span>
          );
        })}
      </span>
      {showValue && <span className="text-caption text-text-muted">({value.toFixed(1)})</span>}
      <span className="sr-only">{value} out of {max} stars</span>
    </span>
  );
}
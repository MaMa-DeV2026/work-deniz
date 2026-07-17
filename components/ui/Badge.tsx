import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'primary' | 'secondary' | 'accent' | 'muted';
};

const tones = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/30 text-text-dark',
  accent: 'bg-accent text-text-dark',
  muted: 'bg-surface text-text-muted',
};

export function Badge({ className, tone = 'primary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-caption font-medium tracking-wide',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export default Badge;
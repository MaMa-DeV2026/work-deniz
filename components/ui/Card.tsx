import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl bg-white border border-accent/60 shadow-sm',
        hover && 'transition-shadow duration-400 ease-silk hover:shadow-lg',
        paddings[padding],
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export default Card;
import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes, useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Hide password when window loses focus (e.g., Alt+Tab away)
    useEffect(() => {
      if (!isPassword) return;
      const hide = () => setShowPassword(false);
      window.addEventListener('blur', hide);
      return () => window.removeEventListener('blur', hide);
    }, [isPassword]);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-body-sm font-medium text-text-dark">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={inputType}
            className={cn(
              'w-full rounded-lg border border-accent bg-white px-4 py-3 text-body-sm text-text-dark outline-none transition-colors duration-300',
              'focus:border-primary placeholder:text-text-muted/60',
              isPassword && 'pr-12',
              error && 'border-red-400',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowPassword(true);
              }}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={(e) => {
                e.preventDefault();
                setShowPassword(true);
              }}
              onTouchEnd={() => setShowPassword(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-dark hover:bg-accent/50 transition-colors duration-200 focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <span className="text-caption text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-body-sm font-medium text-text-dark">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-accent bg-white px-4 py-3 text-body-sm text-text-dark outline-none transition-colors duration-300',
          'focus:border-primary placeholder:text-text-muted/60 resize-y min-h-[120px]',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <span className="text-caption text-red-500">{error}</span>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

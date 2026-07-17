'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center text-text-dark">
      <p className="font-sans text-[12px] uppercase tracking-[0.3em] text-text-muted">
        Error
      </p>
      <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3rem)] font-light">
        Something went wrong
      </h1>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-full border border-primary px-7 py-3 font-sans text-[12px] uppercase tracking-[0.15em] text-primary transition-colors hover:bg-primary hover:text-white"
      >
        Try again
      </button>
    </main>
  );
}

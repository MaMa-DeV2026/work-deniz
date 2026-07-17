'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          background: '#f5f3ef',
          color: '#1a1a1a',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <h1 style={{ fontWeight: 300, fontSize: '2rem', margin: 0 }}>
          Something went wrong
        </h1>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.75rem 1.75rem',
            borderRadius: '9999px',
            border: '1px solid #1a1a1a',
            background: 'transparent',
            color: '#1a1a1a',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

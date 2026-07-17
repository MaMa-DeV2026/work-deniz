'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const username = String(formData.get('username'));
    const password = String(formData.get('password'));

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-accent/60 bg-white p-8 shadow-sm">
        <h1 className="font-display text-display-sm font-semibold text-primary">Admin Login</h1>
        <p className="mt-1 text-body-sm text-text-muted">Sign in to the DENIZ control panel.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <Input id="username" name="username" label="Username" required autoComplete="username" />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
          />
          {error && <p className="text-caption text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}

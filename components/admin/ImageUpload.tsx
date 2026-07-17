'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  multiple?: false;
  separated?: boolean;
};

export default function ImageUpload({ value, onChange, label, separated = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-body-sm font-medium text-text-dark">{label}</span>}
      {separated ? (
        <div className="flex flex-col gap-7">
          <div className="flex justify-center rounded-xl border border-accent bg-white p-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-accent bg-surface">
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-muted">—</div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2 text-body-sm text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {loading ? 'Uploading…' : 'Upload Image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 text-caption text-red-500 hover:underline"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-accent bg-surface">
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">—</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2 text-body-sm text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {loading ? 'Uploading…' : 'Upload Image'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 text-caption text-red-500 hover:underline"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
        </div>
      )}
      {error && <span className="text-caption text-red-500">{error}</span>}
    </div>
  );
}

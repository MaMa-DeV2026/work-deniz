'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { contactSchema } from '@/lib/validations';
import FadeIn from '@/components/animations/FadeIn';

type Status = 'idle' | 'sending' | 'success' | 'error';

const COPY = {
  fa: {
    name: 'نام', email: 'ایمیل', subject: 'موضوع', message: 'پیام',
    submit: 'ارسال پیام', sending: 'در حال ارسال...',
    success: 'پیام شما ارسال شد', error: 'خطا در ارسال. لطفاً دوباره تلاش کنید.',
  },
  en: {
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
    submit: 'Send Message', sending: 'Sending...',
    success: 'Message sent successfully', error: 'Send failed. Please try again.',
  },
};

const inputBase =
  'w-full border-0 border-b-[1.5px] border-accent bg-transparent py-3 text-body text-text-dark outline-none transition-colors duration-300 placeholder:text-text-muted/60 focus:border-primary';

export default function ContactForm() {
  const locale = useLocale();
  const isFa = locale === 'fa';
  const c = isFa ? COPY.fa : COPY.en;
  const reduce = useReducedMotion();

  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');

  function update(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) {
      const parsed = contactSchema.safeParse({ ...values, [field]: value });
      if (parsed.success) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) fe[String(issue.path[0])] = issue.message;
      setErrors(fe);
      setStatus('idle');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col items-center py-10 text-center">
          <svg viewBox="0 0 52 52" className="h-16 w-16">
            <motion.circle
              cx="26" cy="26" r="24" fill="none" stroke="#1B3A5C" strokeWidth="2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.path
              d="M16 27l7 7 13-14" fill="none" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
            />
          </svg>
          <p className="mt-6 font-display text-[28px] text-primary">{c.success}</p>
        </div>
      </motion.div>
    );
  }

  const fields: { name: keyof typeof values; label: string; type?: string }[] = [
    { name: 'name', label: c.name },
    { name: 'email', label: c.email, type: 'email' },
    { name: 'subject', label: c.subject },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{f.label}</label>
          <input
            id={f.name}
            name={f.name}
            type={f.type ?? 'text'}
            value={values[f.name]}
            onChange={(e) => update(f.name, e.target.value)}
            className={inputBase}
            aria-invalid={!!errors[f.name]}
          />
          {errors[f.name] && (
            <FadeIn duration={0.3}>
              <p className="mt-1 text-[12px] text-[#EF4444]">{errors[f.name]}</p>
            </FadeIn>
          )}
        </div>
      ))}

      <div>
        <label htmlFor="message" className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{c.message}</label>
        <textarea
          id="message" name="message" rows={4} value={values.message}
          onChange={(e) => update('message', e.target.value)}
          className={inputBase + ' resize-none'}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <FadeIn duration={0.3}>
            <p className="mt-1 text-[12px] text-[#EF4444]">{errors.message}</p>
          </FadeIn>
        )}
      </div>

      {status === 'error' && (
        <FadeIn duration={0.3}>
          <p className="text-[12px] text-[#EF4444]">{c.error}</p>
        </FadeIn>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full min-h-[52px] bg-primary py-4 text-[13px] font-medium uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#0A1628] disabled:opacity-70"
      >
        {status === 'sending' ? (
          <span className="mx-auto inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : c.submit}
      </button>
    </form>
  );
}

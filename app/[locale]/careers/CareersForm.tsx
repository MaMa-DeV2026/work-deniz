'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { careerSchema } from '@/lib/validations';
import FadeIn from '@/components/animations/FadeIn';

type Status = 'idle' | 'sending' | 'success' | 'error';

const COPY = {
  fa: {
    name: 'نام', email: 'ایمیل', phone: 'شماره تماس', position: 'موقعیت', message: 'توضیحات',
    resume: 'رزومه (PDF)', submit: 'ارسال درخواست', sending: 'در حال ارسال...',
    success: 'درخواست شما با موفقیت ثبت شد. در اسرع وقت با شما تماس می‌گیریم.',
    error: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
    fileType: 'فقط فایل PDF قابل قبول است',
    fileSize: 'حجم فایل نباید بیشتر از ۵ مگابایت باشد',
    retry: 'تلاش دوباره',
  },
  en: {
    name: 'Name', email: 'Email', phone: 'Phone', position: 'Position', message: 'Message',
    resume: 'Resume (PDF)', submit: 'Submit Application', sending: 'Submitting...',
    success: 'Your application was submitted successfully. We will contact you as soon as possible.',
    error: 'Something went wrong. Please try again.',
    fileType: 'Only PDF files are accepted',
    fileSize: 'File size must not exceed 5MB',
    retry: 'Retry',
  },
};

const ERR = {
  fa: {
    name: 'نام باید حداقل ۲ حرف باشد',
    email: 'ایمیل معتبر نیست',
    phone: 'شماره تلفن معتبر نیست',
    position: 'موقعیت شغلی را انتخاب کنید',
    message: 'توضیحات باید حداقل ۲۰ حرف باشد',
  },
  en: {
    name: 'Name must be at least 2 characters',
    email: 'Invalid email address',
    phone: 'Invalid phone number',
    position: 'Please select a position',
    message: 'Message must be at least 20 characters',
  },
};

const POSITIONS = [
  { value: 'designer', fa: 'طراح', en: 'Designer' },
  { value: 'sales', fa: 'فروش', en: 'Sales' },
  { value: 'support', fa: 'پشتیبانی', en: 'Support' },
  { value: 'other', fa: 'سایر', en: 'Other' },
];

const inputBase =
  'w-full border-0 border-b-[1.5px] border-accent bg-transparent py-3 text-body text-text-dark outline-none transition-colors duration-300 placeholder:text-text-muted/60 focus:border-primary';

function isValid(field: string, value: string): boolean {
  switch (field) {
    case 'name': return value.trim().length >= 2;
    case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone': {
      const d = value.replace(/\D/g, '');
      return d.length >= 10 && d.length <= 15;
    }
    case 'position': return ['designer', 'sales', 'support', 'other'].includes(value);
    case 'message': return value.trim().length >= 20;
    default: return true;
  }
}

export default function CareersForm() {
  const locale = useLocale();
  const isFa = locale === 'fa';
  const c = isFa ? COPY.fa : COPY.en;
  const err = isFa ? ERR.fa : ERR.en;
  const reduce = useReducedMotion();

  const [values, setValues] = useState({ name: '', email: '', phone: '', position: '', message: '' });
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');

  function setField(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) {
      if (isValid(field, value)) {
        setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
      } else {
        setErrors((e) => ({ ...e, [field]: err[field as keyof typeof err] }));
      }
    }
  }

  function onBlur(field: string) {
    if (!isValid(field, values[field as keyof typeof values])) {
      setErrors((e) => ({ ...e, [field]: err[field as keyof typeof err] }));
    } else {
      setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { setResume(null); setResumeError(''); return; }
    if (!file.type.includes('pdf')) { setResume(null); setResumeError(c.fileType); return; }
    if (file.size > 5 * 1024 * 1024) { setResume(null); setResumeError(c.fileSize); return; }
    setResume(file);
    setResumeError('');
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors: Record<string, string> = {};
    (['name', 'email', 'phone', 'position', 'message'] as const).forEach((f) => {
      if (!isValid(f, values[f])) fieldErrors[f] = err[f];
    });
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); setStatus('idle'); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, resumeUrl: resume ? resume.name : '' }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-sm border border-accent bg-surface p-10 text-center"
      >
        <svg viewBox="0 0 52 52" className="mx-auto h-16 w-16">
          <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#1B3A5C" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          <motion.path d="M16 27l7 7 13-14" fill="none" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }} />
        </svg>
        <p className="mt-6 text-body-lg leading-relaxed text-primary">{c.success}</p>
      </motion.div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-sm border border-accent bg-surface p-10 text-center">
        <p className="text-body-lg text-[#EF4444]">{c.error}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 bg-primary px-8 py-3 text-[13px] font-medium uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#0A1628]"
        >
          {c.retry}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{c.name}</label>
        <input id="name" name="name" value={values.name} onChange={(e) => setField('name', e.target.value)} onBlur={() => onBlur('name')} className={inputBase} aria-invalid={!!errors.name} />
        {errors.name && <FadeIn duration={0.3}><p className="mt-1 text-[12px] text-[#EF4444]">{errors.name}</p></FadeIn>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{c.email}</label>
        <input id="email" name="email" type="email" value={values.email} onChange={(e) => setField('email', e.target.value)} onBlur={() => onBlur('email')} className={inputBase} aria-invalid={!!errors.email} />
        {errors.email && <FadeIn duration={0.3}><p className="mt-1 text-[12px] text-[#EF4444]">{errors.email}</p></FadeIn>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{c.phone}</label>
        <input id="phone" name="phone" value={values.phone} onChange={(e) => setField('phone', e.target.value)} onBlur={() => onBlur('phone')} className={inputBase} aria-invalid={!!errors.phone} />
        {errors.phone && <FadeIn duration={0.3}><p className="mt-1 text-[12px] text-[#EF4444]">{errors.phone}</p></FadeIn>}
      </div>

      <div>
        <label htmlFor="position" className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{c.position}</label>
        <div className="relative">
          <select
            id="position" name="position" value={values.position}
            onChange={(e) => setField('position', e.target.value)} onBlur={() => onBlur('position')}
            className={inputBase + ' appearance-none pr-8' + (values.position ? '' : ' text-text-muted/60')}
            aria-invalid={!!errors.position}
          >
            <option value="" disabled>{isFa ? 'انتخاب کنید' : 'Select'}</option>
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>{isFa ? p.fa : p.en}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>
        {errors.position && <FadeIn duration={0.3}><p className="mt-1 text-[12px] text-[#EF4444]">{errors.position}</p></FadeIn>}
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{c.message}</label>
        <textarea id="message" name="message" rows={4} value={values.message} onChange={(e) => setField('message', e.target.value)} onBlur={() => onBlur('message')} className={inputBase + ' resize-none'} aria-invalid={!!errors.message} />
        {errors.message && <FadeIn duration={0.3}><p className="mt-1 text-[12px] text-[#EF4444]">{errors.message}</p></FadeIn>}
      </div>

      <div>
        <label htmlFor="resume" className="mb-1 block text-caption uppercase tracking-[0.1em] text-text-muted">{c.resume}</label>
        <input id="resume" name="resume" type="file" accept="application/pdf" onChange={onFile} className="w-full py-3 text-body text-text-muted file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2 file:text-text-dark" />
        {resumeError && <FadeIn duration={0.3}><p className="mt-1 text-[12px] text-[#EF4444]">{resumeError}</p></FadeIn>}
        {resume && !resumeError && <p className="mt-1 text-[12px] text-primary">{resume.name}</p>}
      </div>

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

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isFa = locale === 'fa';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary px-6 text-center text-white">
      <p className="font-sans text-[12px] uppercase tracking-[0.3em] text-white/60">
        {isFa ? 'خطا' : 'Error'}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,8vw,4.5rem)] font-light leading-none">
        {isFa ? 'مشکلی پیش آمد' : 'Something went wrong'}
      </h1>
      <p className="mt-4 max-w-md font-sans text-[14px] text-white/70">
        {isFa
          ? 'متأسفیم، در بارگذاری این صفحه خطایی رخ داد.'
          : "We're sorry, an unexpected error occurred while loading this page."}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border border-white/70 px-7 py-3 font-sans text-[12px] uppercase tracking-[0.15em] transition-colors hover:bg-white hover:text-primary"
        >
          {isFa ? 'تلاش دوباره' : 'Try again'}
        </button>
        <Link
          href={`/${locale}`}
          className="rounded-full bg-white px-7 py-3 font-sans text-[12px] uppercase tracking-[0.15em] text-primary transition-opacity hover:opacity-90"
        >
          {isFa ? 'بازگشت به خانه' : 'Back home'}
        </Link>
      </div>
    </main>
  );
}

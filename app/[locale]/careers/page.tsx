import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations, getLocale } from 'next-intl/server';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import CareersForm from './CareersForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'fa' ? 'همکاری با دنیز' : 'Careers at DENIZ';
  const description = locale === 'fa'
    ? 'به تیم دنیز بپیوندید. فرصت‌های شغلی در شرکت ساعت‌سازی دنیز.'
    : 'Join the DENIZ team. Career opportunities at Iran\'s premier watch company.';
  return {
    title,
    description,
    alternates: { canonical: `https://denizwatch.com/${locale}/careers` },
    openGraph: { title, description, url: `https://denizwatch.com/${locale}/careers` },
  };
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations('careers');
  const isFa = (await getLocale()) === 'fa';

  return (
    <>
      <section className="bg-surface py-16 md:py-24">
        <div className="container-luxury text-center">
          <FadeIn>
            <h1 className="font-display text-display-lg font-semibold text-primary">
              {isFa ? 'همکاری با ما' : 'Work With Us'}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-body-lg text-text-muted">{t('subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-luxury grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <CareersForm />
          </FadeIn>
          <FadeIn delay={0.1}>
            <Card>
              <p className="text-caption text-text-muted">{isFa ? 'موقعیت‌های باز' : 'Open Positions'}</p>
              <ul className="mt-3 space-y-2 text-body text-text-dark">
                {t.raw('positions').map((p: string, i: number) => (
                  <li key={i} className="border-b border-accent/40 pb-2 last:border-0">
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

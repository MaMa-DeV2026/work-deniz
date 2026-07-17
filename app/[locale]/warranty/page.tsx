import type { Metadata } from 'next';
import { unstable_setRequestLocale, getTranslations, getLocale } from 'next-intl/server';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import LocationsSection from '@/components/sections/LocationsSection';
import { Check, X } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = locale === 'fa' ? 'گارانتی دنیز' : 'DENIZ Warranty';
  const description = locale === 'fa'
    ? 'گارانتی دو ساله دنیز برای تمامی محصولات. شرایط، پوشش و مراحل استفاده از گارانتی.'
    : 'DENIZ 2-year warranty on all products. Coverage, terms and claim process.';
  return {
    title,
    description,
    alternates: { canonical: `https://denizwatch.com/${locale}/warranty` },
    openGraph: { title, description, url: `https://denizwatch.com/${locale}/warranty` },
  };
}

export default async function WarrantyPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('warranty');
  const isFa = (await getLocale()) === 'fa';

  const covered = t.raw('covered') as string[];
  const notCovered = t.raw('notCovered') as string[];
  const steps = t.raw('claimSteps') as string[];

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-surface">
        <div className="container-luxury py-24 text-center">
          <FadeIn>
            <span className="text-caption uppercase tracking-[0.3em] text-secondary-dark">
              {t('badge')}
            </span>
            <h1 className="mt-4 font-display text-display-lg font-semibold text-primary">
              {t('title')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-body-lg text-text-muted">{t('subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Warranty card */}
      <section className="container-luxury">
        <FadeIn>
          <Card className="overflow-hidden p-0">
            <div className="grid items-center gap-8 md:grid-cols-2">
              {/* Big number */}
              <div className="flex flex-col items-center justify-center bg-accent/40 py-16">
                <div className="font-display text-[140px] leading-none text-primary">
                  {isFa ? '۲' : '2'}
                </div>
                <p className="mt-2 font-display text-2xl text-text-muted">
                  {isFa ? 'سال' : 'Years'}
                </p>
                <p className="mt-1 text-caption uppercase tracking-[0.3em] text-secondary-dark">
                  {t('periodTitle')}
                </p>
              </div>

              {/* Description + covered / not covered */}
              <div className="px-8 py-12 md:px-12">
                <p className="text-body text-text-dark">{t('periodDesc')}</p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {t('coveredTitle')}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {covered.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-body-sm text-text-dark">
                          <Check size={18} className="mt-0.5 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {t('notCoveredTitle')}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {notCovered.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-body-sm text-text-muted">
                          <X size={18} className="mt-0.5 shrink-0 text-secondary-dark" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </FadeIn>
      </section>

      {/* 3. How to Claim */}
      <section className="container-luxury py-24">
        <FadeIn className="text-center">
          <h2 className="font-display text-display-sm font-semibold text-primary">
            {t('claimTitle')}
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-accent/60 bg-white p-8">
                <span
                  className="font-display text-[48px] font-semibold leading-none text-accent"
                  style={{ WebkitTextStroke: '1px rgba(27,58,92,0.15)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 text-body text-text-dark">{step}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 4. Service centers — same as homepage */}
      <section>
        <div className="container-luxury">
          <FadeIn className="text-center">
            <h2 className="font-display text-display-sm font-semibold text-primary">
              {t('serviceTitle')}
            </h2>
          </FadeIn>
        </div>
        <LocationsSection />
      </section>

      {/* 5. CTA */}
      <section className="bg-surface">
        <div className="container-luxury flex flex-col items-center gap-6 py-24 text-center">
          <FadeIn>
            <p className="max-w-xl text-body-lg text-text-muted">{t('ctaDesc')}</p>
            <div className="mt-6">
              <LinkButton href={`/${locale}/contact`} size="lg">
                {t('cta')}
              </LinkButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

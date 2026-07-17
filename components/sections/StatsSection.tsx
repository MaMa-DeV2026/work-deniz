import { getLocale } from 'next-intl/server';
import FadeIn from '@/components/animations/FadeIn';
import CounterUp from '@/components/animations/CounterUp';

export default async function StatsSection() {
  const locale = await getLocale();
  const isFa = locale === 'fa';

  const stats = [
    { value: 5, suffix: '+', fa: 'سال', en: 'Years' },
    { value: 12, suffix: '', fa: 'مدل', en: 'Models' },
    { value: 4, suffix: '', fa: 'شهر', en: 'Cities' },
    { value: 100, suffix: '%', fa: 'رضایت', en: 'Satisfaction' },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container-luxury">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-accent">
          {stats.map((s, i) => (
            <FadeIn key={s.en} delay={i * 0.1} className="text-center">
              <p className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-light leading-none text-primary">
                <CounterUp target={s.value} suffix={s.suffix} duration={1.5} />
              </p>
              <p className="mt-3 text-[13px] uppercase tracking-[0.1em] text-text-muted">
                {isFa ? s.fa : s.en}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

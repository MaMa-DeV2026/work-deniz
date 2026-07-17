import { getLocale } from 'next-intl/server';
import FadeIn from '@/components/animations/FadeIn';

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
    </svg>
  );
}

function AuthenticityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path d="M12 2l2.4 2.4 3.3-.6.6 3.3L21 12l-2.7 2.4-.6 3.3-3.3-.6L12 22l-2.4-2.7-3.3.6-.6-3.3L3 12l2.7-2.4.6-3.3 3.3.6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function QualityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path d="M6 3h12l3 6-9 12L3 9z" />
      <path d="M3 9h18M9 3l3 6 3-6" />
    </svg>
  );
}

const VALUES = [
  {
    fa: 'دقت',
    en: 'Precision',
    Icon: TargetIcon,
    faDesc: 'هر قطعه با دقت میکرونی و مکانیزم دقیق ساخته می‌شود.',
    enDesc: 'Every piece is engineered to micron-level precision.',
  },
  {
    fa: 'اصالت',
    en: 'Authenticity',
    Icon: AuthenticityIcon,
    faDesc: 'طراحی ایرانی با ریشه‌های اصیل و ماندگار.',
    enDesc: 'Iranian design rooted in enduring heritage.',
  },
  {
    fa: 'کیفیت',
    en: 'Quality',
    Icon: QualityIcon,
    faDesc: 'مواد درجه یک با گارانتی جهانی پنج ساله.',
    enDesc: 'Premium materials backed by a 5-year global warranty.',
  },
];

export default async function BrandStatement() {
  const locale = await getLocale();
  const isFa = locale === 'fa';
  const quote = isFa ? 'هنر زمان از یزد، برای دنیا' : 'The Art of Time, From Yazd to the World';

  return (
    <section className="bg-surface py-20 md:py-32">
      <div className="container-luxury">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="block font-display text-[clamp(4rem,15vw,7.5rem)] leading-[0] text-accent">“</span>
          <div className="mx-auto">
            <p
              className="font-display italic text-primary"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.2 }}
            >
              {quote}
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.Icon;
            return (
              <FadeIn key={v.en} delay={i * 0.1}>
                <div className="text-center md:text-left">
                  <div className="mb-4 text-primary">
                    <Icon />
                  </div>
                  <h3 className="text-[14px] font-medium uppercase tracking-[0.15em] text-text-dark">
                    {isFa ? v.fa : v.en}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-text-muted">
                    {isFa ? v.faDesc : v.enDesc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

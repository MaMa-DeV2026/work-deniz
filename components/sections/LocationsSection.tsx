import { getLocale } from 'next-intl/server';
import { cn } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';

const CITIES = [
  {
    fa: 'یزد',
    en: 'Yazd',
    active: true,
    addressFa: 'خیابان امام خمینی، پلاک ۱۲',
    addressEn: 'Imam Khomeini St., No. 12',
    phone: '+98 35 1234 5678',
  },
  {
    fa: 'قم',
    en: 'Qom',
    active: true,
    addressFa: 'بلوار امین، مجتمع زمان، طبقه ۲',
    addressEn: 'Amin Blvd., Zamaneh Complex, 2nd Floor',
    phone: '+98 25 9876 5432',
  },
  {
    fa: 'اصفهان',
    en: 'Isfahan',
    active: true,
    addressFa: 'چهارباغ بالا، کوچهٔ صنعت ۴',
    addressEn: 'Chaharbagh St., Industry Alley 4',
    phone: '+98 31 5555 1234',
  },
  {
    fa: 'تهران',
    en: 'Tehran',
    active: true,
    addressFa: 'خیابان ولیعصر، پلاک ۲۴۰۰',
    addressEn: 'Valiasr St., No. 2400',
    phone: '+98 21 8888 7777',
  },
  {
    fa: 'شیراز',
    en: 'Shiraz',
    active: false,
    addressFa: 'خیابان زند، پلاک ۸۸',
    addressEn: 'Zand St., No. 88',
    phone: '+98 71 4444 3333',
  },
  {
    fa: 'مشهد',
    en: 'Mashhad',
    active: false,
    addressFa: 'بلوار وکیل‌آباد، پلاک ۱۰',
    addressEn: 'Vakilabad Blvd., No. 10',
    phone: '+98 51 2222 1111',
  },
];

export default async function LocationsSection() {
  const locale = await getLocale();
  const isFa = locale === 'fa';

  return (
    <section className="bg-surface py-16 md:py-24">
      <div className="container-luxury">
        <FadeIn>
          <h2 className="text-center font-display text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-primary">
            {isFa ? 'نمایندگی‌های ما' : 'Our Dealers'}
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3">
          {CITIES.map((c, i) => (
            <FadeIn key={c.en} delay={(i % 3) * 0.1}>
              <div
                className={cn(
                  'h-full rounded-sm border p-6 transition-colors duration-300',
                  c.active
                    ? 'border-accent bg-white hover:border-primary hover:shadow-sm'
                    : 'cursor-default border-accent/60 bg-white/70'
                )}
              >
                <div className="flex items-center gap-2">
                  {c.active && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                  )}
                  <h3 className={cn('font-display text-[clamp(1.125rem,3vw,1.5rem)] font-semibold', c.active ? 'text-primary' : 'text-[#9CA3AF]')}>
                    {c.en}
                  </h3>
                </div>
                <p className={cn('mt-1 font-fa text-[16px]', c.active ? 'text-text-muted' : 'text-[#9CA3AF]')}>
                  {c.fa}
                </p>

                {c.active ? (
                  <>
                    <p className="mt-3 text-[12px] text-text-muted">
                      {isFa ? c.addressFa : c.addressEn}
                    </p>
                    <p className="mt-1 text-[12px] text-text-muted">{c.phone}</p>
                  </>
                ) : (
                  <span className="mt-3 inline-block rounded-full bg-[#F0F4F8] px-3 py-1 text-[11px] text-[#9CA3AF]">
                    {isFa ? 'به زودی' : 'Coming Soon'}
                  </span>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

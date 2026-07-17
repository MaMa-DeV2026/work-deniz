import type { Metadata } from 'next';
import { unstable_setRequestLocale, getLocale } from 'next-intl/server';
import Image from 'next/image';
import FadeIn from '@/components/animations/FadeIn';
import StatsSection from '@/components/sections/StatsSection';
import AboutVideo from '@/components/sections/AboutVideo';

const BRAND_STORY = {
  fa: 'دنیز در دل شهر یزد، جایی که زمان با هنر گره خورده است، متولد شد. ما باور داریم ساعت تنها ابزار اندازه‌گیری زمان نیست، بلکه روایتی است از دقت، اصالت و زیبایی. هر قطعه با دستی توانمند و دلی عاشق ساخته می‌شود تا لحظه‌های ماندگار شما را همراهی کند.',
  en: 'DENIZ was born in the heart of Yazd, where time is woven with art. We believe a watch is more than a tool to measure time — it is a story of precision, authenticity and beauty. Every piece is crafted by skilled hands and a passionate heart to accompany your most enduring moments.',
};

const FOUNDER_BIO = {
  fa: 'رضا احمدی با بیش از دو دهه تجربه در صنعت ساعت‌سازی، دنیز را با هدف معرفی هنر ایرانی به جهان بنیان نهاد. او معتقد است کیفیت و اصالت، میراثی است که نسل به نسل منتقل می‌شود.',
  en: 'With over two decades in watchmaking, Reza Ahmadi founded DENIZ to introduce Iranian artistry to the world. He believes quality and authenticity are a legacy passed from one generation to the next.',
};

const VALUES = [
  {
    num: '01',
    fa: 'دقت',
    en: 'Precision',
    faDesc: 'هر مکانیزم با تلرانس میکرونی تنظیم می‌شود. دقت، زیربنای هر ساعت دنیز است.',
    enDesc: 'Every movement is tuned to micron-level tolerance. Precision is the foundation of every DENIZ watch.',
  },
  {
    num: '02',
    fa: 'اصالت',
    en: 'Authenticity',
    faDesc: 'طراحی برگرفته از میراث ایرانی، بی‌آنکه ذره‌ای از مدرنیته بکاهد. اصالت، امضای ماست.',
    enDesc: 'Design drawn from Iranian heritage without sacrificing modernity. Authenticity is our signature.',
  },
  {
    num: '03',
    fa: 'میراث',
    en: 'Heritage',
    faDesc: 'ساعت‌های ما برای ماندگاری ساخته می‌شوند؛ یادگاری که نسل‌ها را به هم پیوند می‌دهد.',
    enDesc: 'Our watches are built to last — heirlooms that connect generations across time.',
  },
];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = locale === 'fa' ? 'درباره دنیز' : 'About DENIZ';
  const description = locale === 'fa'
    ? 'دنیز در دل شهر یزد، جایی که زمان با هنر گره خورده است، متولد شد. داستان ما را بخوانید.'
    : 'DENIZ was born in the heart of Yazd, where time is woven with art. Read our story.';
  return {
    title,
    description,
    alternates: { canonical: `https://denizwatch.com/${locale}/about` },
    openGraph: { title, description, url: `https://denizwatch.com/${locale}/about` },
  };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const isFa = (await getLocale()) === 'fa';

  return (
    <>
      {/* 1. Page Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden md:h-[55vh]">
        <Image
          src="/images/placeholder/about-hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(27,58,92,0.65)' }} />
        <div className="relative z-10 px-6 text-center">
          <FadeIn>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">DENIZ WATCH COMPANY</p>
            <h1 className="mt-4 font-display text-[clamp(2rem,8vw,4rem)] font-semibold text-white">
              {isFa ? 'درباره‌ی دنیز' : 'About DENIZ'}
            </h1>
            <p className="mt-3 font-display italic text-[clamp(1rem,3vw,1.375rem)] text-white/70">
              {isFa ? 'هنر، دقت، و زمان' : 'Art, Precision, and Time'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Brand Story */}
      <section className="py-16 md:py-24">
        <div className="container-luxury grid items-center gap-12 md:grid-cols-2">
          <FadeIn direction="left" className="order-2 md:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
              <Image
                src="/images/about/founder.jpg"
                alt={isFa ? 'داستان برند دنیز' : 'The Story of DENIZ'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn direction="right" className="order-1 md:order-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-secondary">
              {isFa ? 'داستان ما' : 'Our Story'}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,5vw,2.5rem)] text-primary">
              {isFa ? 'هنرِ زمان، از یزد' : 'The Art of Time, From Yazd'}
            </h2>
            <p className="mt-5 text-[16px] leading-[1.8] text-text-muted">{BRAND_STORY[isFa ? 'fa' : 'en']}</p>
          </FadeIn>
        </div>
      </section>

      {/* 3. Founder */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-luxury">
          <FadeIn>
            <div className="border-l-[3px] border-primary pl-8">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full md:h-20 md:w-20">
                  <Image
                    src="/images/about/story.jpg"
                    alt={isFa ? 'رضا احمدی، بنیان‌گذار دنیز' : 'Reza Ahmadi, Founder of DENIZ'}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-[clamp(1.125rem,3.5vw,1.75rem)] text-primary">{isFa ? 'رضا احمدی' : 'Reza Ahmadi'}</h3>
                  <p className="text-[13px] uppercase tracking-[0.15em] text-secondary">
                    {isFa ? 'بنیان‌گذار و مدیرعامل' : 'Founder & CEO'}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-[16px] leading-[1.7] text-text-muted">{FOUNDER_BIO[isFa ? 'fa' : 'en']}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. Stats */}
      <StatsSection />

      {/* 5. Values */}
      <section className="py-16 md:py-24">
        <div className="container-luxury">
          <FadeIn>
            <h2 className="text-center font-display text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-primary">
              {isFa ? 'ارزش‌های ما' : 'Our Values'}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <FadeIn key={v.en} delay={i * 0.1}>
                <div className="relative overflow-hidden rounded-sm border border-accent/60 p-8">
                  <span className="absolute -right-2 -top-4 font-display text-[clamp(3rem,12vw,6rem)] leading-none text-accent">
                    {v.num}
                  </span>
                  <div className="relative">
                    <h3 className="font-display text-[clamp(1.125rem,3.5vw,1.75rem)] text-primary">{isFa ? v.fa : v.en}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
                      {isFa ? v.faDesc : v.enDesc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Video Placeholder */}
      <AboutVideo />
    </>
  );
}

'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { EASE_LUXURY } from '@/lib/motion';
import { cn } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';
import TextReveal from '@/components/animations/TextReveal';
import type { Locale } from '@/lib/i18n';

type Slide = {
  image: string;
  overlay: string;
  alignment: 'center' | 'left' | 'right';
  eyebrow: string;
  headline_fa: string;
  headline_en: string;
  subline_fa: string;
  subline_en: string;
  cta_fa: string;
  cta_en: string;
  ctaHref: string;
};

const SLIDES: Slide[] = [
  {
    image: '/images/hero/slide-2-collection.png',
    overlay: 'rgba(27,58,92,0.38)',
    alignment: 'center',
    eyebrow: 'DENIZ WATCH COMPANY',
    headline_fa: 'هنرِ زمان',
    headline_en: 'The Art of Time',
    subline_fa: 'ساعت‌هایی که داستان می‌گویند',
    subline_en: 'Timepieces That Tell Stories',
    cta_fa: 'مشاهده‌ی کالکشن',
    cta_en: 'Explore Collection',
    ctaHref: '/collection',
  },
  {
    image: '/images/placeholder/watch.png',
    overlay: 'rgba(10,22,40,0.46)',
    alignment: 'left',
    eyebrow: 'DENIZ CLASSIC COLLECTION',
    headline_fa: 'کالکشن کلاسیک',
    headline_en: 'Classic Collection',
    subline_fa: 'طراحی‌ای که از زمان فراتر می‌رود',
    subline_en: 'Design That Transcends Time',
    cta_fa: 'مشاهده‌ی کالکشن',
    cta_en: 'View Collection',
    ctaHref: '/collection',
  },
  {
    image: '/images/hero/slide-3-craftsmanship.png',
    overlay: 'rgba(27,58,92,0.42)',
    alignment: 'right',
    eyebrow: 'CRAFTSMANSHIP',
    headline_fa: 'دقت در هر جزئیات',
    headline_en: 'Precision in Every Detail',
    subline_fa: 'از متریال تا مکانیزم',
    subline_en: 'From Material to Mechanism',
    cta_fa: 'بیشتر بدانید',
    cta_en: 'Discover More',
    ctaHref: '/about',
  },
];

const AUTOPLAY_MS = 5000;
const RESUME_MS = 8000;

function alignClasses(alignment: Slide['alignment'], locale: Locale): string {
  if (alignment === 'center') return 'items-center text-center';
  const isFa = locale === 'fa';
  const left = isFa ? 'items-end text-right' : 'items-start text-left';
  const right = isFa ? 'items-start text-left' : 'items-end text-right';
  return alignment === 'left' ? left : right;
}

export default function HeroSlider() {
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touch, setTouch] = useState(false);
  const pausedRef = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setTouch(
      typeof window !== 'undefined' &&
        window.matchMedia('(pointer: coarse)').matches
    );
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Autoplay
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((p) => (p + 1) % SLIDES.length);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  // Pause on user interaction, resume after RESUME_MS
  const pauseThenResume = () => {
    setPaused(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_MS);
  };

  const go = (i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
    pauseThenResume();
  };
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  const slide = SLIDES[index];
  const isFa = locale === 'fa';
  const headline = isFa ? slide.headline_fa : slide.headline_en;
  const subline = isFa ? slide.subline_fa : slide.subline_en;
  const cta = isFa ? slide.cta_fa : slide.cta_en;
  const ctaHref = `/${locale}${slide.ctaHref}`;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-primary">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: reduce ? 0 : 1.0, ease: EASE_LUXURY } }}
          exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.5, ease: EASE_LUXURY } }}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={headline}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={72}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="absolute inset-0" style={{ background: slide.overlay }} />

          {/* Content (draggable on touch for swipe) */}
          <motion.div
            className="relative z-10 flex h-screen w-full"
            drag={touch ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              const offsetOk = Math.abs(info.offset.x) > 50;
              const velocityOk = Math.abs(info.velocity.x) > 200;
              if (offsetOk || velocityOk) {
                if (info.offset.x < 0) next();
                else prev();
              }
            }}
          >
            <div
              className={cn(
                'container-luxury flex h-full w-full flex-col pt-[100px]',
                alignClasses(slide.alignment, locale)
              )}
            >
              <FadeIn direction="up" distance={10} delay={0.2} duration={0.5}>
                <p className="font-sans font-semibold text-[12px] uppercase tracking-[0.3em] text-white/80">
                  {slide.eyebrow}
                </p>
              </FadeIn>

              <h1
                className={cn(
                  'mt-5 text-display-xl font-bold text-white',
                  isFa ? 'font-fa' : 'font-display'
                )}
              >
                <TextReveal text={headline} delay={0.4} />
              </h1>

              <FadeIn direction="up" distance={10} delay={0.7} duration={0.5}>
                <p
                  className={cn(
                    'mt-6 max-w-xl font-semibold text-body-lg text-white/80',
                    slide.alignment === 'center' && 'mx-auto'
                  )}
                >
                  {subline}
                </p>
              </FadeIn>

              <FadeIn direction="up" distance={10} delay={0.9} duration={0.5}>
                <div className="mt-10">
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.8)] px-9 py-3.5 font-sans text-[12px] uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-primary"
                  >
                    {cta}
                  </Link>
                </div>
              </FadeIn>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows (desktop only) */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white md:flex"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={next}
        className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white md:flex"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i)}
            className="flex items-center justify-center"
          >
            <span
              className={cn(
                'block rounded-full transition-all duration-300',
                i === index ? 'h-2 w-2 bg-white' : 'h-1.5 w-1.5 bg-white/40'
              )}
            />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 z-20 h-0.5 w-full bg-white/20">
        <motion.div
          key={index}
          className="h-full bg-white/85"
          initial={{ width: reduce ? '100%' : '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: reduce ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
        />
      </div>
    </section>
  );
}

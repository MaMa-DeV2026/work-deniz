'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/lib/motion';
import { cn } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';

const TESTIMONIALS = [
  {
    en: { name: 'Sara M.', city: 'Tehran', text: 'A DENIZ watch is a masterpiece of precision and beauty. The build quality is simply unmatched.' },
    fa: { name: 'سارا م.', city: 'تهران', text: 'ساعت DENIZ شاهکاری از دقت و زیبایی است. کیفیت ساخت آن بی‌نظیر است.' },
  },
  {
    en: { name: 'Ali R.', city: 'Isfahan', text: 'Excellent after-sales service and a truly professional team. I am extremely satisfied.' },
    fa: { name: 'علی ر.', city: 'اصفهان', text: 'خدمات پس از فروش عالی و تیمی بسیار حرفه‌ای. بسیار راضی هستم.' },
  },
  {
    en: { name: 'Maryam K.', city: 'Yazd', text: 'A unique design with a genuine sense of luxury. An unforgettable gift for my husband.' },
    fa: { name: 'مریم ک.', city: 'یزد', text: 'طراحی منحصر به فرد و حسی واقعی از لوکس بودن. هدیه‌ای به‌یادماندنی برای همسرم.' },
  },
  {
    en: { name: 'Reza T.', city: 'Qom', text: 'Timeless elegance and reliable movement. It has become part of my daily ritual.' },
    fa: { name: 'رضا ط.', city: 'قم', text: 'وقار ماندگار و مکانیزمی قابل اعتماد. بخشی از روال روزانه‌ام شده است.' },
  },
  {
    en: { name: 'Nina S.', city: 'Tehran', text: 'From the packaging to the wrist feel, every detail feels intentional and refined.' },
    fa: { name: 'نینا س.', city: 'تهران', text: 'از بسته‌بندی تا حس مچ، هر جزئیاتی آگاهانه و ظریف طراحی شده است.' },
  },
];

export default function TestimonialsSlider() {
  const locale = useLocale();
  const isFa = locale === 'fa';
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(id);
  }, [reduce]);

  const item = isFa ? TESTIMONIALS[index].fa : TESTIMONIALS[index].en;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-luxury">
        <FadeIn>
          <h2 className="text-center font-display text-[clamp(1.75rem,6vw,3rem)] font-semibold text-primary">
            {isFa ? 'آنچه مشتریان می‌گویند' : 'What Our Customers Say'}
          </h2>
        </FadeIn>

        <div className="relative mx-auto mt-12 max-w-3xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE_LUXURY }}
            >
              <span className="block font-display text-[clamp(3rem,10vw,5rem)] leading-none text-primary/15">“</span>
              <p className="mt-2 font-display italic text-[clamp(1rem,3vw,1.375rem)] leading-[1.6] text-primary/80">
                {item.text}
              </p>
              <div className="mt-6 flex items-center justify-center gap-1 text-secondary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="mt-6 text-[14px] text-primary/70">{item.name}</p>
              <p className="text-[12px] text-primary/50">{item.city}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-2 w-2 rounded-full border transition-colors',
                  i === index ? 'border-primary bg-primary' : 'border-primary/40 bg-transparent'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

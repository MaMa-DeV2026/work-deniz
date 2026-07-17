'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { EASE_LUXURY } from '@/lib/motion';
import FadeIn from '@/components/animations/FadeIn';

const FAQS = [
  {
    en: { q: 'How long is the DENIZ warranty?', a: 'All DENIZ watches come with a 5-year international warranty covering movement and manufacturing defects.' },
    fa: { q: 'گارانتی ساعت‌های DENIZ چند سال است؟', a: 'تمامی ساعت‌های DENIZ دارای گارانتی بین‌المللی ۵ ساله شامل مکانیزم و عیوب ساخت هستند.' },
  },
  {
    en: { q: 'Can I get service outside Tehran?', a: 'Yes. Active service centers in Yazd, Qom, Isfahan and Tehran handle repairs and maintenance.' },
    fa: { q: 'آیا امکان سرویس در شهرستان وجود دارد؟', a: 'بله، نمایندگی‌های فعال در یزد، قم، اصفهان و تهران خدمات تعمیر و نگهداری ارائه می‌دهند.' },
  },
  {
    en: { q: 'Do you ship internationally?', a: 'International shipping is available to selected countries upon coordination with our support team.' },
    fa: { q: 'ارسال به خارج از کشور دارید؟', a: 'ارسال بین‌المللی برای کشورهای منتخب از طریق هماهنگی با پشتیبانی امکان‌پذیر است.' },
  },
  {
    en: { q: 'What materials are used?', a: 'We use surgical-grade stainless steel, titanium and sapphire crystal for lasting durability and clarity.' },
    fa: { q: 'از چه متریال‌هایی استفاده می‌شود؟', a: 'ما از استیل درجه جراحی، تیتانیوم و کریستال یاقوت برای دوام و شفافیت ماندگار استفاده می‌کنیم.' },
  },
  {
    en: { q: 'Can I customize a timepiece?', a: 'Selected collections offer engraving and strap options. Contact a dealer for availability.' },
    fa: { q: 'امکان سفارشی‌سازی ساعت وجود دارد؟', a: 'برخی کالکشن‌ها گزینه‌های حکاکی و بند را ارائه می‌دهند. برای موجودی با نمایندگی تماس بگیرید.' },
  },
];

export default function FAQSection() {
  const locale = useLocale();
  const isFa = locale === 'fa';
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="container-luxury max-w-3xl">
        <FadeIn>
          <h2 className="text-center font-display text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-primary">FAQ</h2>
        </FadeIn>

        <div className="mt-10">
          {FAQS.map((f, i) => {
            const item = isFa ? f.fa : f.en;
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-accent">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  {!isFa && (
                    <span className="text-secondary">
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  )}
                  <span className="flex-1 text-[16px] text-text-dark">{item.q}</span>
                  {isFa && (
                    <span className="text-secondary">
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE_LUXURY }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[15px] leading-[1.7] text-text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

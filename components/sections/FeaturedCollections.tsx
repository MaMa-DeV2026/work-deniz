import { getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/animations/FadeIn';

export default async function FeaturedCollections() {
  const locale = await getLocale();
  const isFa = locale === 'fa';

  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: 'asc' },
    take: 3,
  });

  return (
    <section className="py-16 md:py-24">
      <div className="container-luxury">
        <FadeIn>
          <h2 className="text-center font-display text-[48px] font-semibold text-primary">
            {isFa ? 'کالکشن‌های ویژه' : 'Featured Collections'}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-3 text-center text-[16px] text-text-muted">
            {isFa
              ? 'داستان هر کالکشن، روایتی از دقت و اصالت.'
              : 'Every collection is a story of precision and authenticity.'}
          </p>
        </FadeIn>

        <div className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {collections.map((c, i) => (
            <FadeIn
              key={c.id}
              delay={i * 0.1}
              className="min-w-[78%] snap-start sm:min-w-[60%] md:min-w-0"
            >
              <Link
                href={`/${locale}/collection`}
                className="group relative block h-[min(400px,60vw)] w-full overflow-hidden rounded-sm"
              >
                <Image
                  src={c.coverImage}
                  alt={isFa ? c.name_fa : c.name_en}
                  fill
                  sizes="(max-width: 768px) 80vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,22,40,0.6)] to-transparent" />
                <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-[28px] font-semibold text-white">
                    {isFa ? c.name_fa : c.name_en}
                  </h3>
                  <span className="mt-1 inline-block text-[13px] uppercase tracking-[0.15em] text-white/80">
                    {isFa ? 'مشاهده' : 'View'} →
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

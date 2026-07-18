import type { Metadata } from 'next';
import { unstable_setRequestLocale, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import CollectionView from '@/components/collection/CollectionView';

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'fa' ? 'کالکشن‌های ما' : 'Our Collections';
  const description = locale === 'fa'
    ? 'کالکشن‌های انحصاری دنیز — هر قطعه داستانی از هنر و دقت.'
    : 'Discover DENIZ exclusive collections — every piece tells a story of art and precision.';
  return {
    title,
    description,
    alternates: { canonical: `https://denizwatch.com/${locale}/collection` },
    openGraph: { title, description, url: `https://denizwatch.com/${locale}/collection` },
  };
}

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const isFa = (await getLocale()) === 'fa';

  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { products: { orderBy: { sortOrder: 'asc' } } },
  });

  const collectionsData = collections.map((c: (typeof collections)[number]) => ({ id: c.id, name: isFa ? c.name_fa : c.name_en }));

  const products = collections.flatMap((c) =>
    c.products.map((p: (typeof c.products)[number]) => ({
      id: p.id,
      name: isFa ? p.name_fa : p.name_en,
      collection: isFa ? c.name_fa : c.name_en,
      collectionId: c.id,
      material: p.material,
      specs: `${p.material} · ${p.caseDiameter}`,
      rating: p.rating,
      image: p.images?.[0] ?? c.coverImage ?? '',
    }))
  );

  return (
    <>
      <section className="flex min-h-[25vh] items-center justify-center bg-surface py-12 md:h-[35vh] md:py-0">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-secondary">DENIZ COLLECTIONS</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,8vw,3.5rem)] text-primary">
            {isFa ? 'کالکشن‌های ما' : 'Our Collections'}
          </h1>
          <div className="mx-auto mt-4 h-px w-[60px] bg-secondary" />
        </div>
      </section>

      <CollectionView locale={locale} products={products} collections={collectionsData} />
    </>
  );
}

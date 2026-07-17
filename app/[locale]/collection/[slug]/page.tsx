import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { LinkButton } from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import Image from 'next/image';

export const revalidate = 1800;

export async function generateStaticParams() {
  const collections = await prisma.collection.findMany();
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('products');
  const isFa = locale === 'fa';

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: { products: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!collection) notFound();

  return (
    <div className="container-luxury px-4 py-16 md:px-6 md:py-24 lg:px-0">
      <FadeIn>
        <h1 className="font-display text-display-lg font-semibold text-primary">
          {isFa ? collection.name_fa : collection.name_en}
        </h1>
        <p className="mt-3 max-w-2xl text-body-lg text-text-muted">
          {isFa ? collection.description_fa : collection.description_en}
        </p>
      </FadeIn>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {collection.products.map((p) => (
          <FadeIn key={p.id}>
            <Card hover padding="none" className="overflow-hidden">
              <div className="relative aspect-square w-full overflow-hidden bg-surface">
                <Image
                  src={p.images[0] ?? collection.coverImage}
                  alt={isFa ? p.name_fa : p.name_en}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-display-sm text-text-dark">
                  {isFa ? p.name_fa : p.name_en}
                </h3>
                <LinkButton href={`/${locale}/product/${p.id}`} variant="ghost" size="sm" className="mt-3">
                  {t('viewDetails')}
                </LinkButton>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
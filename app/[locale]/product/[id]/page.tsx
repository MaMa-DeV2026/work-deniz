import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import StarRating from '@/components/ui/StarRating';
import ProductGallery from '@/components/product/ProductGallery';

const MATERIAL_FA: Record<string, string> = {
  Steel: 'استیل',
  Titanium: 'تیتانیوم',
  Ceramic: 'سرامیک',
};

export const revalidate = 1800;

export async function generateStaticParams() {
  const products = await prisma.product.findMany();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { collection: true } });
  if (!product) return { title: 'DENIZ Watch' };
  const name = locale === 'fa' ? product.name_fa : product.name_en;
  const desc = (locale === 'fa' ? product.description_fa : product.description_en).slice(0, 160);
  return {
    title: `${name} - DENIZ Watch`,
    description: desc,
    alternates: { canonical: `https://denizwatch.com/${locale}/product/${id}` },
    openGraph: {
      title: name,
      description: desc,
      url: `https://denizwatch.com/${locale}/product/${id}`,
      type: 'website',
      images: product.images?.[0] ? [{ url: product.images[0], width: 1200, height: 1200 }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  unstable_setRequestLocale(locale);
  const isFa = (await getLocale()) === 'fa';

  const product = await prisma.product.findUnique({
    where: { id },
    include: { collection: true },
  });

  if (!product) notFound();

  const name = isFa ? product.name_fa : product.name_en;
  const desc = isFa ? product.description_fa : product.description_en;
  const materialValue = isFa ? MATERIAL_FA[product.material] ?? product.material : product.material;

  const specs = [
    { label: isFa ? 'متریال' : 'Material', value: materialValue },
    { label: isFa ? 'مکانیزم' : 'Movement', value: product.movement },
    { label: isFa ? 'مقاومت آب' : 'Water Resistance', value: product.waterResistance },
    { label: isFa ? 'قطر قاب' : 'Case Diameter', value: product.caseDiameter },
  ];

  const images = product.images?.length ? product.images : [product.collection.coverImage];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_en,
    description: product.description_en,
    brand: {
      '@type': 'Brand',
      name: 'DENIZ',
    },
    material: product.material,
    image: images,
  };

  return (
    <div className="container-luxury px-4 py-10 md:px-6 md:py-16 lg:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-8 text-[12px] text-text-muted">
        <Link href={`/${locale}`} className="transition-colors hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/collection`} className="transition-colors hover:text-primary">
          {isFa ? 'کالکشن' : 'Collection'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-dark">{name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={images} name={name} />

        <div>
          <span className="inline-block bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-secondary">
            {isFa ? product.collection.name_fa : product.collection.name_en}
          </span>
          <h1 className="mt-2 font-display text-[clamp(1.5rem,5vw,2.5rem)] text-text-dark">{name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <StarRating value={product.rating} size="sm" />
            <span className="text-[12px] text-text-muted">{isFa ? '۰ نظر' : '0 reviews'}</span>
          </div>

          <div className="my-6 h-px bg-accent" />

          <div className="divide-y divide-[#F0F0F0]">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3">
                <span className="text-[12px] uppercase text-text-muted">{s.label}</span>
                <span className="text-[14px] text-text-dark">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="my-6 h-px bg-accent" />

          <p className="text-[16px] leading-[1.7] text-text-muted">{desc}</p>

          <Link
            href={`/${locale}/collection`}
            className="mt-8 inline-block text-[13px] text-primary transition-opacity hover:opacity-70"
          >
            {isFa ? '← بازگشت به کالکشن' : '← Back to Collection'}
          </Link>
        </div>
      </div>
    </div>
  );
}

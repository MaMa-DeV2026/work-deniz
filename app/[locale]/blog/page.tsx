import type { Metadata } from 'next';
import { unstable_setRequestLocale, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@/lib/types';
import FadeIn from '@/components/animations/FadeIn';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 900;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'fa' ? 'مجله دنیز' : 'DENIZ Journal';
  const description = locale === 'fa'
    ? 'مجله دنیز — داستان‌هایی از دنیای ساعت، هنر و زمان.'
    : 'DENIZ Journal — stories from the world of watches, art, and time.';
  return {
    title,
    description,
    alternates: { canonical: `https://denizwatch.com/${locale}/blog` },
    openGraph: { title, description, url: `https://denizwatch.com/${locale}/blog` },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  const isFa = (await getLocale()) === 'fa';

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  const [featured, ...rest] = posts;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-24 text-center">
        <div className="container-luxury">
          <p className="text-[11px] uppercase tracking-[0.3em] text-secondary">JOURNAL</p>
          <h1 className="mt-4 font-display text-[72px] text-primary">
            {isFa ? 'مجله‌ی دنیز' : 'DENIZ Journal'}
          </h1>
          <p className="mt-3 font-display italic text-[22px] text-text-muted">
            {isFa ? 'داستان‌هایی از دنیای ساعت' : 'Stories From The World of Watches'}
          </p>
          <div className="mx-auto mt-8 h-px w-[80px] bg-accent" />
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="container-luxury pb-16">
          <FadeIn>
            <BlogCard post={featured} locale={locale} isFa={isFa} featured />
          </FadeIn>
        </section>
      )}

      {/* Remaining posts */}
      {rest.length > 0 && (
        <section className="container-luxury pb-24">
          <div className="grid gap-10 md:grid-cols-2">
            {rest.map((post: BlogPost, i: number) => (
              <FadeIn key={post.id} delay={(i % 2) * 0.05}>
                <BlogCard post={post} locale={locale} isFa={isFa} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

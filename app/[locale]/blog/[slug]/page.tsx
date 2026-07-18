import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import type { BlogPost } from '@/lib/types';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import FadeIn from '@/components/animations/FadeIn';
import BlogCard from '@/components/blog/BlogCard';

export const revalidate = 900;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: { published: true } });
  return posts.map((p: BlogPost) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: 'DENIZ Journal' };
  const isFa = locale === 'fa';
  const title = isFa ? post.title_fa : post.title_en;
  const description = isFa ? (post.excerpt_fa || '').slice(0, 160) : (post.excerpt_en || '').slice(0, 160);
  return {
    title: `${title} | DENIZ Journal`,
    description,
    alternates: { canonical: `https://denizwatch.com/${locale}/blog/${slug}` },
    openGraph: {
      title: `${title} | DENIZ Journal`,
      description,
      url: `https://denizwatch.com/${locale}/blog/${slug}`,
      type: 'article',
      images: post.coverImage ? [post.coverImage] : [],
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | DENIZ Journal`,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  unstable_setRequestLocale(locale);
  const isFa = (await getLocale()) === 'fa';

  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const title = isFa ? post.title_fa : post.title_en;
  const content = isFa ? post.content_fa : post.content_en;
  const paragraphs = content.split('\n').filter(Boolean);
  const date = formatDate(post.publishedAt ?? post.createdAt, isFa ? 'fa' : 'en');
  const category = isFa ? 'ژورنال' : 'Journal';

  const related = await prisma.blogPost.findMany({
    where: { published: true, NOT: { id: post.id } },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title_en,
    author: { '@type': 'Person', name: post.author },
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage,
    description: post.excerpt_en,
    publisher: {
      '@type': 'Organization',
      name: 'DENIZ Watch Company',
      logo: {
        '@type': 'ImageObject',
        url: 'https://denizwatch.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://denizwatch.com/en/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cover image — full width, 50vh */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <article className="mx-auto max-w-[720px] px-6 py-16">
        {/* Author bar */}
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-[18px] text-primary">
            {post.author.charAt(0)}
          </span>
          <div className="text-[13px] text-text-muted">
            <p className="text-text-dark">{post.author}</p>
            <p>{date} · {post.readTime} min read</p>
          </div>
        </div>

        <h1 className="mt-8 font-display text-[52px] leading-[1.15] text-text-dark">{title}</h1>
        <span className="mt-4 inline-block bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-secondary">
          {category}
        </span>
        <div className="my-8 h-px bg-accent" />

        <div className="blog-prose">
          {paragraphs.map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-[720px] px-6 pb-24">
          <h2 className="font-display text-[28px] text-primary">
            {isFa ? 'مطالب مرتبط' : 'Related Articles'}
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {related.map((r: BlogPost) => (
              <BlogCard key={r.id} post={r} locale={locale} isFa={isFa} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

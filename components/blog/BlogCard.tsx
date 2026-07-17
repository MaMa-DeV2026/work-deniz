import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

type Post = {
  id: string;
  title_fa: string;
  title_en: string;
  slug: string;
  excerpt_fa: string;
  excerpt_en: string;
  coverImage: string;
  author: string;
  publishedAt: Date | null;
  createdAt: Date;
  readTime: number;
};

export default function BlogCard({
  post,
  locale,
  isFa,
  featured = false,
}: {
  post: Post;
  locale: string;
  isFa: boolean;
  featured?: boolean;
}) {
  const title = isFa ? post.title_fa : post.title_en;
  const excerpt = isFa ? post.excerpt_fa : post.excerpt_en;
  const category = isFa ? 'ژورنال' : 'Journal';
  const date = formatDate(post.publishedAt ?? post.createdAt, isFa ? 'fa' : 'en');
  const readMore = isFa ? 'ادامه‌ی مطلب ←' : 'Read More →';

  if (featured) {
    return (
      <Link href={`/${locale}/blog/${post.slug}`} className="group grid items-center gap-10 md:grid-cols-2">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={post.coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div>
          <span className="inline-block bg-primary px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-white">Featured</span>
          <p className="mt-4 text-[11px] uppercase tracking-[0.15em] text-secondary">{category}</p>
          <h2 className="mt-2 font-display text-[36px] leading-tight text-text-dark transition-colors group-hover:text-primary">{title}</h2>
          <p className="mt-3 text-[16px] leading-[1.7] text-text-muted line-clamp-3">{excerpt}</p>
          <p className="mt-4 text-[13px] text-[#9CA3AF]">{post.author} · {date} · {post.readTime} min read</p>
          <span className="mt-4 inline-block text-[13px] text-primary transition-all group-hover:underline">{readMore}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="py-6">
        <p className="text-[11px] uppercase tracking-[0.15em] text-secondary">{category}</p>
        <h2 className="mt-2 font-display text-[24px] leading-snug text-text-dark transition-colors group-hover:text-primary">{title}</h2>
        <p className="mt-3 text-[15px] leading-[1.7] text-text-muted line-clamp-2">{excerpt}</p>
        <p className="mt-4 text-[13px] text-[#9CA3AF]">{post.author} · {date} · {post.readTime} min read</p>
      </div>
    </Link>
  );
}

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { unstable_setRequestLocale } from 'next-intl/server';
import HeroSlider from '@/components/sections/HeroSlider';
import FeaturedCollections from '@/components/sections/FeaturedCollections';

const BrandStatement = dynamic(() => import('@/components/sections/BrandStatement'));
const StatsSection = dynamic(() => import('@/components/sections/StatsSection'));
const LocationsSection = dynamic(() => import('@/components/sections/LocationsSection'));
import FAQSection from '@/components/sections/FAQSection';
import TestimonialsSlider from '@/components/sections/TestimonialsSlider';

const siteUrl = 'https://denizwatch.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === 'fa';
  return {
    alternates: { canonical: `${siteUrl}/${locale}` },
    openGraph: {
      title: isFa ? 'DENIZ Watch Company | هنرِ زمان' : 'DENIZ Watch Company | The Art of Time',
      description: isFa
        ? 'دنیز، برند ساعت‌های مچی لوکس ایرانی. کالکشن‌های انحصاری ما را کشف کنید.'
        : 'DENIZ, Iran\'s luxury watch brand. Discover our exclusive collections of premium timepieces.',
      url: `${siteUrl}/${locale}`,
      images: ['/images/placeholder/hero-slide-1.svg'],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DENIZ Watch Company',
    alternateName: 'دنیز',
    url: siteUrl,
    logo: 'https://denizwatch.com/logo.png',
    description: 'Iran\'s luxury watch brand combining modern design with superior quality.',
    foundingDate: '2020',
    founder: {
      '@type': 'Person',
      name: 'Reza Ahmadi',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yazd',
      addressCountry: 'IR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-35-1234-5678',
      contactType: 'customer service',
      email: 'info@denizwatch.com',
    },
    sameAs: [
      'https://instagram.com/denizwatch',
      'https://linkedin.com/company/denizwatch',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSlider />
      <FeaturedCollections />
      <BrandStatement />
      <StatsSection />
      <LocationsSection />
      <FAQSection />
      <TestimonialsSlider />
    </>
  );
}

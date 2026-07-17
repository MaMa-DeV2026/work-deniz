import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import localFont from 'next/font/local';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { locales, getLocaleDirection } from '@/lib/i18n';

const inter = localFont({
  src: [
    { path: '../../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = localFont({
  src: [
    { path: '../../public/fonts/Cormorant-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Cormorant-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Cormorant-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Cormorant-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Cormorant-Italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFa = locale === 'fa';

  const faMetadata: Metadata = {
    title: { default: 'DENIZ Watch Company | هنرِ زمان', template: '%s | دنیز' },
    description: 'دنیز، برند ساعت‌های مچی لوکس ایرانی با طراحی مدرن و کیفیت برتر. کالکشن‌های ما را کشف کنید.',
    keywords: ['برند دنیز', 'بهترین ساعت یزد', 'بهترین برند ساعت ایرانی', 'ساعت مچی لوکس', 'DENIZ Watch'],
    openGraph: {
      title: 'DENIZ Watch Company | هنرِ زمان',
      description: 'دنیز، برند ساعت‌های مچی لوکس ایرانی با طراحی مدرن و کیفیت برتر.',
      url: 'https://denizwatch.com',
      siteName: 'DENIZ Watch',
      locale: 'fa_IR',
      type: 'website',
    },
  };

  const enMetadata: Metadata = {
    title: { default: 'DENIZ Watch Company | The Art of Time', template: '%s | DENIZ' },
    description: 'DENIZ, Iran\'s luxury watch brand combining modern design with superior quality. Explore our collections of premium timepieces.',
    keywords: ['DENIZ Watch', 'Iran luxury watch brand', 'Persian watchmaker', 'premium timepiece', 'Yazd watch'],
    openGraph: {
      title: 'DENIZ Watch Company | The Art of Time',
      description: 'DENIZ, Iran\'s luxury watch brand combining modern design with superior quality.',
      url: 'https://denizwatch.com',
      siteName: 'DENIZ Watch',
      locale: 'en_US',
      type: 'website',
    },
  };

  const metadata = isFa ? faMetadata : enMetadata;

  return {
    ...metadata,
    twitter: {
      card: 'summary_large_image',
      title: metadata.openGraph!.title as string,
      description: metadata.openGraph!.description as string,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://denizwatch.com/${locale}`,
      languages: {
        fa: 'https://denizwatch.com/fa',
        en: 'https://denizwatch.com/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  unstable_setRequestLocale(locale);
  const messages = await getMessages();
  const dir = getLocaleDirection(locale as (typeof locales)[number]);

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="pt-[58px]">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

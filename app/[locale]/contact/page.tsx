import type { Metadata } from 'next';
import { unstable_setRequestLocale, getLocale } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import ContactForm from './ContactForm';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const title = locale === 'fa' ? 'تماس با ما' : 'Contact Us';
  const description = locale === 'fa'
    ? 'با تیم دنیز در ارتباط باشید. یزد، ایران. info@denizwatch.com'
    : 'Get in touch with DENIZ. Yazd, Iran. info@denizwatch.com';
  return {
    title,
    description,
    alternates: { canonical: `https://denizwatch.com/${locale}/contact` },
    openGraph: { title, description, url: `https://denizwatch.com/${locale}/contact` },
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const isFa = (await getLocale()) === 'fa';

  const info = isFa
    ? {
        title: 'اطلاعات تماس',
        address: 'یزد، ایران',
        phone: '+98 35 1234 5678',
        email: 'info@denizwatch.com',
        hours: 'شنبه تا چهارشنبه، ۹ تا ۱۷',
      }
    : {
        title: 'Contact Information',
        address: 'Yazd, Iran',
        phone: '+98 35 1234 5678',
        email: 'info@denizwatch.com',
        hours: 'Sat-Wed, 9AM-5PM',
      };

  const mapEmbed = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'DENIZ Watch Company',
    alternateName: 'دنیز',
    url: 'https://denizwatch.com',
    logo: 'https://denizwatch.com/logo.png',
    image: '/images/placeholder/hero-slide-1.svg',
    telephone: '+98-35-1234-5678',
    email: 'info@denizwatch.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yazd',
      addressCountry: 'IR',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
      opens: '09:00',
      closes: '17:00',
    },
  };

  return (
    <div className="container-luxury px-4 py-16 md:px-6 md:py-24 lg:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FadeIn className="text-center">
        <h1 className="font-display text-display-lg font-semibold text-primary">
          {isFa ? 'تماس با ما' : 'Contact Us'}
        </h1>
      </FadeIn>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <FadeIn>
          <ContactForm />
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-display text-[clamp(1.25rem,4vw,2rem)] text-primary">{info.title}</h2>
          <ul className="mt-8 space-y-6">
            <li className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span className="text-body text-text-muted">{info.address}</span>
            </li>
            <li className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span className="text-body text-text-muted">{info.phone}</span>
            </li>
            <li className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <a href={`mailto:${info.email}`} className="text-body text-text-muted transition-colors hover:text-primary">{info.email}</a>
            </li>
            <li className="flex items-start gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span className="text-body text-text-muted">{info.hours}</span>
            </li>
          </ul>

          <div className="mt-10 flex gap-4 text-text-muted">
            <a href="#" aria-label="Instagram" className="transition-colors hover:text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M4.98 3.5a2 2 0 11-.02 4 2 2 0 01.02-4zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V21H9z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="transition-colors hover:text-primary">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M22 5.9c-.7.32-1.46.53-2.25.63a3.93 3.93 0 001.72-2.17c-.76.45-1.6.78-2.5.95a3.9 3.9 0 00-6.65 3.56A11.06 11.06 0 013.15 4.6a3.9 3.9 0 001.2 5.2 3.9 3.9 0 01-1.77-.49v.05a3.9 3.9 0 003.13 3.82c-.5.14-1.04.16-1.55.06a3.9 3.9 0 003.64 2.7A7.83 7.83 0 012 18.28a11.05 11.05 0 005.98 1.75c7.18 0 11.1-5.95 11.1-11.1v-.5c.76-.55 1.43-1.23 1.95-2.02z" />
              </svg>
            </a>
          </div>
        </FadeIn>
      </div>

      <div className="mt-20 overflow-hidden rounded-sm">
        {mapEmbed ? (
          <iframe
            src={mapEmbed}
            title="DENIZ Watch - Yazd, Iran"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[400px] w-full border-0 grayscale"
          />
        ) : (
          <div className="flex h-[400px] w-full items-center justify-center bg-surface text-[18px] tracking-[0.2em] text-text-muted">
            Yazd, Iran
          </div>
        )}
      </div>
    </div>
  );
}

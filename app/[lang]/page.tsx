import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CinematicExperience } from '@/components/cinematic/CinematicExperience';
import { enDictionary } from '@/config/translations/en';
import { arDictionary } from '@/config/translations/ar';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const dict = isAr ? arDictionary : enDictionary;

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: '/en',
        ar: '/ar',
      },
    },
    openGraph: {
      type: 'website',
      locale: isAr ? 'ar_TN' : 'en_US',
      alternateLocale: isAr ? ['en_US'] : ['ar_TN'],
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      siteName: dict.meta.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
    },
  };
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'ar') {
    notFound();
  }

  return (
    <main className="w-full min-h-screen bg-[#0E0C0A]">
      <CinematicExperience />
    </main>
  );
}

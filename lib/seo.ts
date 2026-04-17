import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eggsbot.com';
const siteName = 'EGGS.BOT';
const defaultDescription =
  'Find the cheapest eggs near you. Real-time egg price comparison across Walmart, Kroger, Aldi, Costco, and Target. Track egg price trends with BLS CPI data.';

export function buildMetadata({
  title,
  description,
  path = '',
  ogImage,
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl}${path}`;
  const imageUrl = ogImage || `${siteUrl}/og-default.png`;

  return {
    title,
    description,
    keywords: [
      'egg prices',
      'cheapest eggs near me',
      'egg price comparison',
      'grocery prices',
      'egg price tracker',
      ...keywords,
    ].join(', '),
    authors: [{ name: 'EGGS.BOT' }],
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      site: '@eggsbot',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const defaultMetadata: Metadata = buildMetadata({
  title: 'EGGS.BOT — Find the Cheapest Eggs Near You',
  description: defaultDescription,
  keywords: [
    'egg prices today',
    'cheapest eggs',
    'why are eggs so expensive',
    'egg price history',
  ],
});

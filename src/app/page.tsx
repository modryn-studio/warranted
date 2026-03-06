import type { Metadata } from 'next';
import { Suspense } from 'react';
import { site } from '@/config/site';
import PageContent from './page-content';

export const metadata: Metadata = {
  title: site.ogTitle,
  description: site.description,
  openGraph: {
    title: site.ogTitle,
    description: site.ogDescription,
    url: site.url,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: site.ogTitle }],
  },
};

export default function Home() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}

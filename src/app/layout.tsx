import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { site } from '@/config/site';
import { SiteSchema } from '@/components/site-schema';
import FeedbackWidget from '@/components/feedback-widget';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.ogTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.ogTitle,
    description: site.ogDescription,
    url: site.url,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: site.ogTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.ogTitle,
    description: site.ogDescription,
    site: site.social.twitterHandle,
    creator: site.social.twitterHandle,
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: site.accent,
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="dark">
      <head>
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <SiteSchema />
        {children}
        <FeedbackWidget />
        <Analytics />
      </body>
    </html>
  );
}

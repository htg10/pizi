import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PIZI — Verified PG Accommodations',
    template: '%s | PIZI',
  },
  description: 'Find verified PG accommodations in Delhi NCR, Noida & more. Live better, stay smarter.',
  keywords: ['PG', 'paying guest', 'hostel', 'accommodation', 'Delhi', 'Noida', 'Mukherjee Nagar'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://pizi.in',
    siteName: 'PIZI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="font-sans bg-cream text-ink-950 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

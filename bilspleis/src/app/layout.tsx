// filepath: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bilspleis | Beregn kjørekostnader for turer i Norge',
  description: 'Planlegg din reise i Norge med nøyaktig beregning av drivstoff- og bompengepriser. Spar penger på dine bilturer.',
  keywords: 'kjørekostnader, bilkostnader, bompenger, drivstoffpriser, Norge, rute, reiseplanlegger, kostnadsberegner, bilspleis, biløkonomi',
  authors: [{ name: 'Bilspleis Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Bilspleis | Beregn kjørekostnader for turer i Norge',
    description: 'Planlegg din reise i Norge med nøyaktig beregning av drivstoff- og bompengepriser.',
    url: 'https://bilspleis.no',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme) {
                    document.documentElement.classList.add(savedTheme + '-mode');
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark-mode');
                  }
                } catch (err) {}
              })();
            `,
          }}
        />
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Bilspleis",
                "description": "Beregn kjørekostnader for turer i Norge, inkludert drivstoff og bompenger",
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "NOK"
                }
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        
        <footer className="site-footer">
          <div className="container">
            <div className="copyright">
              &copy; {new Date().getFullYear()} Bilspleis. Alle rettigheter reservert.
            </div>
          </div>
        </footer>
        
        <ThemeToggle />

        {/* Google AdSense Script */}
        <Script 
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726641596892047"
          crossOrigin="anonymous"
        />
        
        {/* Google Analytics Script */}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-8KJNNPHE9E"
        />
        <Script
          id="gtag-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8KJNNPHE9E');
            `
          }}
        />
      </body>
    </html>
  );
}

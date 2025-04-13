// filepath: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import Script from 'next/script';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DriveCalc | Kjørekostnader Norge - Beregn drivstoff og bompenger',
  description: 'Nøyaktig beregning av kjørekostnader i Norge inkludert drivstoff, bompenger og avgifter. Ideell for planlegging av bilreiser og kostnadsfordeling.',
  keywords: 'beregne kjørekostnad, bompenge kalkulator, bensinpris, dieselpris, kjøregodtgjørelse, kjørekostnader Norge, bilkostnader, bompengeberegner, drivstoffpriser Norge, kjørekostnader, bompenger, drivstoffpriser, Norge, rute, reiseplanlegger, kostnadsberegner, drivecalc, biløkonomi, biltur, bilreise, bensinpriser, toll costs, driving expenses, Norway travel, fuel calculator',
  authors: [{ name: 'DriveCalc Team' }],
  robots: 'index, follow',
  metadataBase: new URL('https://drivecalc.no'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DriveCalc | Kjørekostnader Norge - Beregn drivstoff og bompenger',
    description: 'Nøyaktig beregning av kjørekostnader i Norge inkludert drivstoff, bompenger og avgifter.',
    url: 'https://drivecalc.no',
    type: 'website',
    siteName: 'DriveCalc',
    locale: 'nb_NO',
    images: [
      {
        url: 'https://drivecalc.no/og-image.png', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'DriveCalc - Beregn kjørekostnader i Norge',
      }
    ],
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
        {/* Add this meta tag with your AdSense publisher ID */}
        <meta 
          name="google-adsense-account" 
          content="ca-pub-7726641596892047"
        />
        
        {/* Update the AdSense script with a key prop */}
        <Script 
          id="adsbygoogle-init"
          strategy="lazyOnload" // Changed from beforeInteractive
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726641596892047"
          crossOrigin="anonymous"
        />
        
        {/* Theme script with suppressHydrationWarning */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
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
        
        {/* Structured data with Next.js Script component */}
        <Script
          id="schema-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "DriveCalc",
                "description": "Beregn kjørekostnader for turer i Norge, inkludert drivstoff og bompenger",
                "url": "https://drivecalc.no",
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "NOK"
                },
                "author": {
                  "@type": "Organization",
                  "name": "DriveCalc Team",
                  "url": "https://drivecalc.no"
                },
                "audience": {
                  "@type": "Audience",
                  "audienceType": "Drivers in Norway"
                },
                "inLanguage": "no-NO",
                "keywords": "kjørekostnader, bilkostnader, bompenger, drivstoffpriser, Norge"
              }
            `,
          }}
        />
        <Script
          id="structured-data-calculator"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "DriveCalc Bompenge Kalkulator",
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "NOK"
                },
                "description": "Norges mest nøyaktige bompenge kalkulator og verktøy for å beregne kjørekostnader med oppdaterte bensinpriser.",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "156"
                }
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <header className="site-header">
          <div className="container">
            <nav className="main-nav">
              <div className="logo">
                <Link href="/">DriveCalc</Link>
              </div>
              <ul className="nav-links">
                <li><Link href="/">Kalkulator</Link></li>
                <li><Link href="/tips">Sparetips</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        
        <footer className="site-footer">
          <div className="container">
            <div className="footer-links">
              <Link href="/">Hjem</Link>
              <Link href="/tips">Sparetips</Link>
              <Link href="/faq">Vanlige spørsmål</Link>
            </div>
            <div className="copyright" suppressHydrationWarning>
              &copy; {new Date().getFullYear()} DriveCalc. Alle rettigheter reservert.
            </div>
          </div>
        </footer>
        
        <ThemeToggle />

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

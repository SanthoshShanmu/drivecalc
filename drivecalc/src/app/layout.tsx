// filepath: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import Script from 'next/script';
import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DriveCalc | Kjørekostnader Norge - Calculate Driving Costs in Norway',
  description: 'Nøyaktig beregning av kjørekostnader i Norge inkludert drivstoff, bompenger og avgifter. Accurate calculation of driving costs in Norway including fuel, tolls and fees.',
  keywords: 'beregne kjørekostnad, bompenge kalkulator, bensinpris, dieselpris, kjøregodtgjørelse, kjørekostnader Norge, bilkostnader, bompengeberegner, drivstoffpriser Norge, kjørekostnader, bompenger, drivstoffpriser, Norge, rute, reiseplanlegger, kostnadsberegner, drivecalc, biløkonomi, biltur, bilreise, bensinpriser, toll costs, driving expenses, Norway travel, fuel calculator, road trip Norway, toll roads Norway',
  authors: [{ name: 'DriveCalc Team' }],
  robots: 'index, follow',
  metadataBase: new URL('https://drivecalc.no'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'no': '/',
    },
  },
  openGraph: {
    title: 'DriveCalc | Kjørekostnader Norge - Calculate Driving Costs in Norway',
    description: 'Nøyaktig beregning av kjørekostnader i Norge inkludert drivstoff, bompenger og avgifter. Accurate calculation of driving costs in Norway including fuel, tolls and fees.',
    url: 'https://drivecalc.no',
    type: 'website',
    siteName: 'DriveCalc',
    locale: 'nb_NO',
    images: [
      {
        url: 'https://drivecalc.no/og-image.png',
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
        <meta 
          name="google-adsense-account" 
          content="ca-pub-7726641596892047"
        />
        
        <Script 
          id="adsbygoogle-init"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726641596892047"
          crossOrigin="anonymous"
        />
        
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
                }
                catch (err) {}
              })();
            `,
          }}
        />
        
        {/* Structured data for English and Norwegian */}
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
                "description": "Calculate driving costs for trips in Norway, including fuel and toll fees. Beregn kjørekostnader for turer i Norge, inkludert drivstoff og bompenger.",
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
                "inLanguage": ["no", "en"],
                "keywords": "driving costs, toll fees, fuel prices, Norway, kjørekostnader, bompenger, drivstoffpriser"
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
                "name": "DriveCalc Toll Calculator",
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "NOK"
                },
                "description": "Norway's most accurate toll calculator and tool for calculating driving costs with updated fuel prices. Norges mest nøyaktige bompenge kalkulator og verktøy for å beregne kjørekostnader med oppdaterte bensinpriser.",
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
        <LanguageProvider>
          <Header />
          
          {children}
          
          <Footer />
          
          <ThemeToggle />
        </LanguageProvider>

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

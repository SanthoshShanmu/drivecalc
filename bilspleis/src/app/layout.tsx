// filepath: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bilspleis | Beregn kjørekostnader for turer i Norge',
  description: 'Planlegg din reise i Norge med nøyaktig beregning av drivstoff- og bompengepriser. Velg start og destinasjon, kjøretøytype og få en oversikt over totale kjørekostnader.',
  keywords: 'kjørekostnader, bilkostnader, bompenger, drivstoffpriser, Norge, rute, reiseplanlegger, kostnadsberegner',
  robots: 'index, follow',
  openGraph: {
    title: 'Bilspleis | Beregn kjørekostnader for turer i Norge',
    description: 'Planlegg din reise i Norge med nøyaktig beregning av drivstoff- og bompengepriser.',
    url: 'https://bilspleis.no',
    siteName: 'Bilspleis',
    locale: 'nb_NO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body className={inter.className}>
        
        {children}
        
        <footer className="site-footer">
          <div className="container">
            <div className="copyright">
              &copy; {new Date().getFullYear()} Bilspleis. Alle rettigheter reservert.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

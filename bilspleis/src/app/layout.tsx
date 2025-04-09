// filepath: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bilspleis | Beregn kjørekostnader for turer i Norge',
  description: 'Planlegg din reise i Norge med nøyaktig beregning av drivstoff- og bompengepriser. Velg start og destinasjon, kjøretøytype og få en oversikt over totale kjørekostnader.',
  keywords: 'kjørekostnader, bilkostnader, bompenger, drivstoffpriser, Norge, rute, reiseplanlegger, kostnadsberegner',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark-mode');
                  } else if (savedTheme === 'light') {
                    document.documentElement.classList.add('light-mode');
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark-mode');
                  }
                } catch (e) {}
              })();
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

        {/* Script to prevent theme flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'dark' || 
                     (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark-mode');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

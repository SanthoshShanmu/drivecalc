// filepath: src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bilspleis | Beregn kjørekostnader for turer i Norge',
  description: 'Planlegg din reise i Norge med nøyaktig beregning av drivstoff- og bompengepriser.',
  keywords: 'kjørekostnader, bilkostnader, bompenger, drivstoffpriser, Norge, rute, reiseplanlegger, kostnadsberegner',
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
      </body>
    </html>
  );
}

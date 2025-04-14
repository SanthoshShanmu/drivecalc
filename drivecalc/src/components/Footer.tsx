"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { language, t } = useLanguage();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-links">
          <Link href={language === 'en' ? "/en" : "/"}>
            {t('footer.home')}
          </Link>
          <Link href={language === 'en' ? "/en/tips" : "/tips"}>
            {t('footer.tips')}
          </Link>
          <Link href={language === 'en' ? "/en/faq" : "/faq"}>
            {t('footer.faq')}
          </Link>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} DriveCalc. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
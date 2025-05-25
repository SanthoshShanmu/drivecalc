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
          <Link href={language === 'en' ? "/en/toll-system" : "/toll-system"}>
            {language === 'en' ? 'Toll System' : 'Bomsystem'}</Link>
          <Link href={language === 'en' ? "/en/ad-policy" : "/ad-policy"}>
            {language === 'en' ? 'Ad Policy' : 'Annonsepolicy'}</Link>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} DriveCalc. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const { language, t } = useLanguage();
  
  return (
    <header className="site-header">
      <div className="container">
        <nav className="main-nav">
          <div className="logo">
            <Link href={language === 'en' ? "/en" : "/"}>DriveCalc</Link>
          </div>
          <div className="nav-right">
            <ul className="nav-links">
              <li>
                <Link href={language === 'en' ? "/en" : "/"}>
                  {t('nav.calculator')}
                </Link>
              </li>
              <li>
                <Link href={language === 'en' ? "/en/tips" : "/tips"}>
                  {t('nav.tips')}
                </Link>
              </li>
              <li>
                <Link href={language === 'en' ? "/en/faq" : "/faq"}>
                  {t('nav.faq')}
                </Link>
              </li>
            </ul>
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
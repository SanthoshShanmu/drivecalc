"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  // Handle language switching with navigation
  const handleLanguageSwitch = (newLanguage: 'no' | 'en') => {
    // Only navigate if the language is actually changing
    if (language === newLanguage) return;
    
    setLanguage(newLanguage);
    
    // Handle navigation based on path
    if (pathname === '/' && newLanguage === 'en') {
      router.push('/en');
    } else if (pathname === '/en' && newLanguage === 'no') {
      router.push('/');
    } else if (pathname.startsWith('/en/')) {
      // We're on an English page, go to Norwegian
      router.push(pathname.replace('/en/', '/'));
    } else if (newLanguage === 'en') {
      // We're on a Norwegian page, go to English
      router.push(`/en${pathname}`);
    }
  };

  return (
    <div className={styles.toggle}>
      <button 
        className={`${styles.toggleButton} ${language === 'no' ? styles.active : ''}`}
        onClick={() => handleLanguageSwitch('no')}
      >
        🇳🇴 Norsk
      </button>
      <button 
        className={`${styles.toggleButton} ${language === 'en' ? styles.active : ''}`}
        onClick={() => handleLanguageSwitch('en')}
      >
        🇬🇧 English
      </button>
    </div>
  );
}
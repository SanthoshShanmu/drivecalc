"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter, usePathname } from 'next/navigation';

// Only accept a simple string prop - no functions
export default function LanguageSwitcher({ language, autoNavigate = false }: { 
  language: 'en' | 'no';
  autoNavigate?: boolean;
}) {
  const { setLanguage, language: currentLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Set the language in context
    setLanguage(language);
    
    // If autoNavigate is true and the language doesn't match the URL structure, navigate
    if (autoNavigate && currentLanguage !== language) {
      if (language === 'en' && !pathname.startsWith('/en')) {
        if (pathname === '/') {
          router.push('/en');
        } else {
          router.push(`/en${pathname}`);
        }
      } else if (language === 'no' && pathname.startsWith('/en')) {
        router.push(pathname.replace('/en', '') || '/');
      }
    }
  }, [language, setLanguage, autoNavigate, currentLanguage, pathname, router]);
  
  // Return null or an empty fragment - this component just has a side effect
  return null;
}
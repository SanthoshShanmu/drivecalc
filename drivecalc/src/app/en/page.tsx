"use client";

import { useEffect } from 'react';
import Home from '../page';
import { useLanguage } from '@/context/LanguageContext';

export default function EnglishHome() {
  const { setLanguage } = useLanguage();
  
  // Force English language
  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <Home />;
}
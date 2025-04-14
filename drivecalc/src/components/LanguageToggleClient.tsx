"use client";

import { useLanguage } from '@/context/LanguageContext';

type Props = {
  noKey: string;
  enKey: string;
};

export default function LanguageToggleClient({ noKey, enKey }: Props) {
  const { language, t } = useLanguage();
  
  return <>{language === 'no' ? t(noKey) : t(enKey)}</>;
}
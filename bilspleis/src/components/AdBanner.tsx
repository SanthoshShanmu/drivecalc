"use client";

import { useEffect, useRef } from 'react';
import styles from './AdBanner.module.css';

interface AdBannerProps {
  adClient: string;
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export default function AdBanner({ 
  adClient, 
  adSlot, 
  adFormat = 'auto',
  className
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  
  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== 'undefined') {
      try {
        // Add AdSense ad code
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (error) {
        console.error('Error loading AdSense:', error);
      }
    }
  }, []);

  return (
    <div className={`${styles.adContainer} ${className || ''}`}>
      <div className={styles.adLabel}>Annonse</div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
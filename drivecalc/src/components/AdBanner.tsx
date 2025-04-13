"use client";

import React, { useEffect, useRef } from 'react';
import styles from './AdBanner.module.css';

interface AdBannerProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  className?: string;
}

export default function AdBanner({ adClient, adSlot, adFormat = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Skip if already loaded or no ref
    if (!adRef.current || isLoaded.current) return;
    
    // Mark as loaded to prevent duplicate initialization
    isLoaded.current = true;
    
    // Store current ref value for cleanup
    const currentRef = adRef.current;
    
    // Create the ad element
    const adElement = document.createElement('ins');
    adElement.className = 'adsbygoogle';
    adElement.style.display = 'block';
    adElement.dataset.adClient = adClient;
    adElement.dataset.adSlot = adSlot;
    adElement.dataset.adFormat = adFormat;
    
    // Clear any existing content
    if (currentRef.firstChild) {
      currentRef.innerHTML = '';
    }
    
    // Add the element to DOM
    currentRef.appendChild(adElement);
    
    // Push the ad command
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.error('Ad loading error:', error);
    }
    
    // Cleanup function
    return () => {
      isLoaded.current = false;
      if (currentRef) {
        currentRef.innerHTML = '';
      }
    };
  }, [adClient, adSlot, adFormat]);

  return <div ref={adRef} className={`${styles.adContainer} ${className}`} />;
}
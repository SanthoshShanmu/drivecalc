"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './AdBanner.module.css';

interface AdBannerProps {
  adClient: string;
  adSlot?: string; // Made optional for verification phase
  adFormat?: string;
  className?: string;
}

export default function AdBanner({ adClient, adSlot, adFormat = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!adRef.current) return;
    
    // Just add a placeholder during verification - don't attempt to load real ads
    const placeholder = document.createElement('div');
    placeholder.textContent = "Advertisement - Our site uses ads to support our service";
    placeholder.style.border = "1px dashed #ccc";
    placeholder.style.padding = "20px";
    placeholder.style.textAlign = "center";
    placeholder.style.color = "#666";
    placeholder.style.minHeight = "120px";
    placeholder.style.display = "flex";
    placeholder.style.alignItems = "center";
    placeholder.style.justifyContent = "center";
    
    // Clear any existing content
    if (adRef.current.firstChild) {
      adRef.current.innerHTML = '';
    }
    
    adRef.current.appendChild(placeholder);
    
    // DO NOT attempt to initialize adsbygoogle during verification
    // We'll add this functionality after approval
  }, []);

  return (
    <div ref={adRef} className={`${styles.adContainer} ${className}`}>
      <div className={styles.adLabel}>Advertisement</div>
    </div>
  );
}
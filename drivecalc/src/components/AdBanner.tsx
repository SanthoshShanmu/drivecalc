"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './AdBanner.module.css';

interface AdBannerProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  className?: string;
}

export default function AdBanner({ adClient, adSlot, adFormat = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  // During verification, just show a placeholder
  // You can update this code after approval
  useEffect(() => {
    if (!adRef.current) return;
    
    // Just add a placeholder during verification
    const placeholder = document.createElement('div');
    placeholder.textContent = "Ad placeholder - awaiting approval";
    placeholder.style.border = "1px dashed #ccc";
    placeholder.style.padding = "20px";
    placeholder.style.textAlign = "center";
    placeholder.style.color = "#666";
    
    // Clear any existing content
    if (adRef.current.firstChild) {
      adRef.current.innerHTML = '';
    }
    
    adRef.current.appendChild(placeholder);
  }, []);

  return (
    <div ref={adRef} className={`${styles.adContainer} ${className}`}>
      <div className={styles.adLabel}>Advertisement</div>
    </div>
  );
}
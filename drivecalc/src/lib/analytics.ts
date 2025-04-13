"use client";

import { useCallback, useEffect, useState } from 'react';

export function useAnalytics() {
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  /**
   * Track an event with Google Analytics
   */
  const trackEvent = useCallback((eventName: string, eventParams: Record<string, any> = {}) => {
    // Only track events on the client side
    if (isClient && typeof window !== 'undefined' && 'gtag' in window) {
      try {
        const gtag = (window as any).gtag;
        console.log(`Tracking event: ${eventName}`, eventParams);
        gtag('event', eventName, eventParams);
      } catch (error) {
        console.error('Error tracking event:', error);
      }
    } else {
      console.log(`Would track event (not in browser): ${eventName}`, eventParams);
    }
  }, [isClient]);

  /**
   * Track a page view
   */
  const trackPageView = useCallback((path: string, title: string) => {
    // Only track page views on the client side
    if (isClient && typeof window !== 'undefined' && 'gtag' in window) {
      try {
        const gtag = (window as any).gtag;
        gtag('config', 'G-8KJNNPHE9E', {
          page_path: path,
          page_title: title
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    }
  }, [isClient]);

  return {
    trackEvent,
    trackPageView
  };
}
"use client";

import { useCallback } from 'react';

export function useAnalytics() {
  /**
   * Track an event with Google Analytics
   */
  const trackEvent = useCallback((eventName: string, eventParams: Record<string, any> = {}) => {
    try {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // Access gtag as a property of the window object
        const gtag = (window as any).gtag;
        
        console.log(`Tracking event: ${eventName}`, eventParams);
        gtag('event', eventName, eventParams);
      } else {
        console.log(`Would track event: ${eventName}`, eventParams);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  /**
   * Track a page view
   */
  const trackPageView = useCallback((path: string, title: string) => {
    try {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as any).gtag;
        
        gtag('config', 'G-XXXXXXXXXX', {
          page_path: path,
          page_title: title
        });
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, []);

  return {
    trackEvent,
    trackPageView
  };
}
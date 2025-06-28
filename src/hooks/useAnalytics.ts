/**
 * React Hook for Google Analytics
 * Provides easy-to-use analytics tracking methods
 */

import { useEffect, useCallback, useRef } from 'react';
import { analytics, type AnalyticsEvent } from '@/utils/analytics';

interface UseAnalyticsOptions {
  trackPageViews?: boolean;
  trackScrollDepth?: boolean;
  trackEngagement?: boolean;
  trackPerformance?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    trackPageViews = true,
    trackScrollDepth = true,
    trackEngagement = true,
    trackPerformance = true
  } = options;

  const engagementStartTime = useRef<number>(Date.now());
  const scrollDepthTracked = useRef<Set<number>>(new Set());
  const isInitialized = useRef<boolean>(false);

  // Initialize analytics
  useEffect(() => {
    if (!isInitialized.current) {
      analytics.init();
      isInitialized.current = true;
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (trackPageViews) {
      analytics.trackPageView();
    }
  }, [trackPageViews, window.location.pathname]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);

      // Track at 25%, 50%, 75%, and 100%
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollDepthTracked.current.has(milestone)) {
          scrollDepthTracked.current.add(milestone);
          analytics.trackScrollDepth(milestone);
        }
      });
    };

    const throttledScroll = throttle(handleScroll, 500);
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [trackScrollDepth]);

  // Track user engagement time
  useEffect(() => {
    if (!trackEngagement) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const engagementTime = Date.now() - engagementStartTime.current;
        analytics.trackEngagement(engagementTime);
      } else {
        engagementStartTime.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const engagementTime = Date.now() - engagementStartTime.current;
      analytics.trackEngagement(engagementTime);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackEngagement]);

  // Track performance metrics
  useEffect(() => {
    if (!trackPerformance) return;

    const trackPerformanceMetrics = () => {
      // Track Core Web Vitals
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              analytics.trackPerformance('first_contentful_paint', entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          analytics.trackPerformance('largest_contentful_paint', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = (entry as any).processingStart - entry.startTime;
            analytics.trackPerformance('first_input_delay', fid);
          }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          analytics.trackPerformance('cumulative_layout_shift', clsValue * 1000, 'score');
        }).observe({ entryTypes: ['layout-shift'] });
      }

      // Track navigation timing
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          analytics.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
          analytics.trackPerformance('load_complete', navigation.loadEventEnd - navigation.loadEventStart);
          analytics.trackPerformance('dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart);
          analytics.trackPerformance('tcp_connect', navigation.connectEnd - navigation.connectStart);
          analytics.trackPerformance('server_response', navigation.responseEnd - navigation.requestStart);
        }, 0);
      });
    };

    trackPerformanceMetrics();
  }, [trackPerformance]);

  // Custom event tracking methods
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  const trackButtonClick = useCallback((buttonName: string, location?: string) => {
    analytics.trackButtonClick(buttonName, location || window.location.pathname);
  }, []);

  const trackFormStart = useCallback((formName: string) => {
    analytics.trackFormEvent(formName, 'start');
  }, []);

  const trackFormSubmit = useCallback((formName: string) => {
    analytics.trackFormEvent(formName, 'submit');
  }, []);

  const trackFormError = useCallback((formName: string, errorType: string) => {
    analytics.trackFormEvent(formName, 'error', errorType);
  }, []);

  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    analytics.trackSearch(searchTerm, resultsCount);
  }, []);

  const trackDownload = useCallback((fileName: string, fileType: string) => {
    analytics.trackDownload(fileName, fileType);
  }, []);

  const trackExternalLink = useCallback((url: string, linkText: string) => {
    analytics.trackExternalLink(url, linkText);
  }, []);

  const trackError = useCallback((errorMessage: string, errorType: string, fatal: boolean = false) => {
    analytics.trackError(errorMessage, errorType, fatal);
  }, []);

  const trackVideo = useCallback((action: 'play' | 'pause' | 'complete', videoTitle: string, progress?: number) => {
    analytics.trackVideo(action, videoTitle, progress);
  }, []);

  const setUserId = useCallback((userId: string) => {
    analytics.setUserId(userId);
  }, []);

  const setUserProperty = useCallback((propertyName: string, value: string) => {
    analytics.setUserProperty(propertyName, value);
  }, []);

  return {
    // Event tracking methods
    trackEvent,
    trackButtonClick,
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackSearch,
    trackDownload,
    trackExternalLink,
    trackError,
    trackVideo,
    
    // User management
    setUserId,
    setUserProperty,
    
    // Direct access to analytics instance
    analytics
  };
}

// Utility function for throttling
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}
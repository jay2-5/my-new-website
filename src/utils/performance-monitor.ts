/**
 * Cross-Browser Performance Monitoring
 * Tracks performance metrics across different browsers
 */

import { BrowserDetector } from './browser-detection';

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  browserInfo: any;
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Basic timing metrics
    this.measureBasicMetrics();
    
    // Web Vitals (if supported)
    this.measureWebVitals();
    
    // Browser-specific optimizations
    this.measureBrowserSpecific();
  }

  private measureBasicMetrics(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
    });
  }

  private measureWebVitals(): void {
    // First Paint and First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            switch (entry.name) {
              case 'first-paint':
                this.metrics.firstPaint = entry.startTime;
                break;
              case 'first-contentful-paint':
                this.metrics.firstContentfulPaint = entry.startTime;
                break;
            }
          }
        });
        
        this.observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('PerformanceObserver not fully supported:', e);
      }
    }

    // Largest Contentful Paint
    this.measureLCP();
    
    // Cumulative Layout Shift
    this.measureCLS();
    
    // First Input Delay
    this.measureFID();
  }

  private measureLCP(): void {
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP measurement not supported:', e);
      }
    }
  }

  private measureCLS(): void {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS measurement not supported:', e);
      }
    }
  }

  private measureFID(): void {
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
          }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID measurement not supported:', e);
      }
    }
  }

  private measureBrowserSpecific(): void {
    const detector = new BrowserDetector();
    this.metrics.browserInfo = detector.detectBrowser();
    
    // Browser-specific performance tracking
    switch (this.metrics.browserInfo.name) {
      case 'Safari':
        this.measureSafariSpecific();
        break;
      case 'Firefox':
        this.measureFirefoxSpecific();
        break;
      case 'Chrome':
      case 'Edge':
        this.measureChromiumSpecific();
        break;
    }
  }

  private measureSafariSpecific(): void {
    // Safari-specific performance metrics
    if ('memory' in performance) {
      console.log('Memory usage:', (performance as any).memory);
    }
  }

  private measureFirefoxSpecific(): void {
    // Firefox-specific performance metrics
    if ('mozMemory' in performance) {
      console.log('Firefox memory:', (performance as any).mozMemory);
    }
  }

  private measureChromiumSpecific(): void {
    // Chrome/Edge-specific performance metrics
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('Chrome memory:', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      });
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Log performance report
   */
  logReport(): void {
    console.group('🚀 Performance Report');
    console.log('Browser:', this.metrics.browserInfo?.name, this.metrics.browserInfo?.version);
    console.log('Load Time:', this.metrics.loadTime?.toFixed(2), 'ms');
    console.log('DOM Content Loaded:', this.metrics.domContentLoaded?.toFixed(2), 'ms');
    console.log('First Paint:', this.metrics.firstPaint?.toFixed(2), 'ms');
    console.log('First Contentful Paint:', this.metrics.firstContentfulPaint?.toFixed(2), 'ms');
    console.log('Largest Contentful Paint:', this.metrics.largestContentfulPaint?.toFixed(2), 'ms');
    console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift?.toFixed(4));
    console.log('First Input Delay:', this.metrics.firstInputDelay?.toFixed(2), 'ms');
    console.groupEnd();
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
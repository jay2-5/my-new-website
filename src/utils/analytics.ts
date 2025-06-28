/**
 * Google Analytics Integration with gtag.js
 * Provides page view tracking and custom events
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface PageViewData {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  content_group1?: string;
  content_group2?: string;
  custom_map?: Record<string, any>;
}

export class Analytics {
  private static instance: Analytics;
  private isInitialized = false;
  private measurementId: string | null = null;
  private isDebugMode = false;

  private constructor() {
    this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || null;
    this.isDebugMode = import.meta.env.DEV || false;
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  /**
   * Initialize Google Analytics
   */
  public async init(): Promise<void> {
    if (this.isInitialized || !this.measurementId) {
      if (this.isDebugMode && !this.measurementId) {
        console.warn('Google Analytics: VITE_GA_MEASUREMENT_ID not found in environment variables');
      }
      return;
    }

    try {
      // Load gtag script
      await this.loadGtagScript();
      
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Configure gtag
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        // Enhanced measurement settings
        enhanced_measurement: true,
        
        // Privacy settings
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        
        // Performance settings
        send_page_view: false, // We'll handle page views manually
        
        // Debug mode for development
        debug_mode: this.isDebugMode,
        
        // Custom configuration
        custom_map: {
          'custom_dimension_1': 'user_type',
          'custom_dimension_2': 'page_category',
          'custom_dimension_3': 'browser_name',
          'custom_dimension_4': 'device_type'
        }
      });

      this.isInitialized = true;
      
      if (this.isDebugMode) {
        console.log('Google Analytics initialized with ID:', this.measurementId);
      }

      // Track initial page view
      this.trackPageView();

    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Load gtag script dynamically
   */
  private loadGtagScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load gtag script'));
      
      document.head.appendChild(script);
    });
  }

  /**
   * Track page view
   */
  public trackPageView(data?: PageViewData): void {
    if (!this.isInitialized || !window.gtag) {
      if (this.isDebugMode) {
        console.warn('Google Analytics not initialized');
      }
      return;
    }

    const pageData: PageViewData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      content_group1: this.getPageCategory(),
      content_group2: this.getDeviceType(),
      ...data
    };

    window.gtag('config', this.measurementId!, pageData);

    if (this.isDebugMode) {
      console.log('Page view tracked:', pageData);
    }
  }

  /**
   * Track custom event
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized || !window.gtag) {
      if (this.isDebugMode) {
        console.warn('Google Analytics not initialized');
      }
      return;
    }

    const eventData = {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      custom_dimension_1: this.getUserType(),
      custom_dimension_2: this.getPageCategory(),
      custom_dimension_3: this.getBrowserName(),
      custom_dimension_4: this.getDeviceType(),
      ...event.custom_parameters
    };

    window.gtag('event', event.action, eventData);

    if (this.isDebugMode) {
      console.log('Event tracked:', event.action, eventData);
    }
  }

  /**
   * Track user engagement
   */
  public trackEngagement(engagementTime: number): void {
    this.trackEvent({
      action: 'user_engagement',
      category: 'engagement',
      value: engagementTime,
      custom_parameters: {
        engagement_time_msec: engagementTime
      }
    });
  }

  /**
   * Track form interactions
   */
  public trackFormEvent(formName: string, action: 'start' | 'submit' | 'error', errorType?: string): void {
    this.trackEvent({
      action: `form_${action}`,
      category: 'form_interaction',
      label: formName,
      custom_parameters: {
        form_name: formName,
        error_type: errorType
      }
    });
  }

  /**
   * Track button clicks
   */
  public trackButtonClick(buttonName: string, location: string): void {
    this.trackEvent({
      action: 'click',
      category: 'button',
      label: buttonName,
      custom_parameters: {
        button_name: buttonName,
        click_location: location
      }
    });
  }

  /**
   * Track scroll depth
   */
  public trackScrollDepth(percentage: number): void {
    this.trackEvent({
      action: 'scroll',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
      custom_parameters: {
        scroll_depth: percentage
      }
    });
  }

  /**
   * Track file downloads
   */
  public trackDownload(fileName: string, fileType: string): void {
    this.trackEvent({
      action: 'file_download',
      category: 'download',
      label: fileName,
      custom_parameters: {
        file_name: fileName,
        file_type: fileType
      }
    });
  }

  /**
   * Track external link clicks
   */
  public trackExternalLink(url: string, linkText: string): void {
    this.trackEvent({
      action: 'click',
      category: 'external_link',
      label: linkText,
      custom_parameters: {
        link_url: url,
        link_text: linkText
      }
    });
  }

  /**
   * Track search queries
   */
  public trackSearch(searchTerm: string, resultsCount?: number): void {
    this.trackEvent({
      action: 'search',
      category: 'site_search',
      label: searchTerm,
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount
      }
    });
  }

  /**
   * Track video interactions
   */
  public trackVideo(action: 'play' | 'pause' | 'complete', videoTitle: string, progress?: number): void {
    this.trackEvent({
      action: `video_${action}`,
      category: 'video',
      label: videoTitle,
      value: progress,
      custom_parameters: {
        video_title: videoTitle,
        video_progress: progress
      }
    });
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metric,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metric,
        metric_value: value,
        metric_unit: unit
      }
    });
  }

  /**
   * Track errors
   */
  public trackError(errorMessage: string, errorType: string, fatal: boolean = false): void {
    this.trackEvent({
      action: 'exception',
      category: 'error',
      label: errorMessage,
      custom_parameters: {
        description: errorMessage,
        error_type: errorType,
        fatal: fatal
      }
    });
  }

  /**
   * Set user properties
   */
  public setUserProperty(propertyName: string, value: string): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('config', this.measurementId!, {
      custom_map: {
        [propertyName]: value
      }
    });
  }

  /**
   * Set user ID for cross-device tracking
   */
  public setUserId(userId: string): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('config', this.measurementId!, {
      user_id: userId
    });
  }

  /**
   * Helper methods for custom dimensions
   */
  private getUserType(): string {
    // Determine user type based on your business logic
    return 'visitor'; // Could be 'customer', 'lead', etc.
  }

  private getPageCategory(): string {
    const path = window.location.pathname;
    if (path === '/') return 'home';
    if (path.includes('consultation')) return 'consultation';
    if (path.includes('services')) return 'services';
    if (path.includes('404')) return 'error';
    return 'other';
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    return 'other';
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return 'mobile';
    }
    if (/iPad/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Consent management
   */
  public updateConsent(consentSettings: {
    analytics_storage?: 'granted' | 'denied';
    ad_storage?: 'granted' | 'denied';
    functionality_storage?: 'granted' | 'denied';
    personalization_storage?: 'granted' | 'denied';
    security_storage?: 'granted' | 'denied';
  }): void {
    if (!this.isInitialized || !window.gtag) return;

    window.gtag('consent', 'update', consentSettings);
  }

  /**
   * Disable tracking (for privacy compliance)
   */
  public disableTracking(): void {
    if (this.measurementId) {
      (window as any)[`ga-disable-${this.measurementId}`] = true;
    }
  }

  /**
   * Enable tracking
   */
  public enableTracking(): void {
    if (this.measurementId) {
      (window as any)[`ga-disable-${this.measurementId}`] = false;
    }
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();
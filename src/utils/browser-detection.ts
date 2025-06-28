/**
 * Browser Detection and Feature Support Utilities
 * Provides methods to detect browsers and their capabilities
 */

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  isMobile: boolean;
  supportsWebGL: boolean;
  supportsWebP: boolean;
  supportsCSS: {
    grid: boolean;
    flexbox: boolean;
    customProperties: boolean;
    backdrop: boolean;
    clipPath: boolean;
  };
}

export class BrowserDetector {
  private userAgent: string;
  private vendor: string;

  constructor() {
    this.userAgent = navigator.userAgent;
    this.vendor = navigator.vendor || '';
  }

  /**
   * Detect the current browser
   */
  detectBrowser(): BrowserInfo {
    const browser = this.getBrowserName();
    const version = this.getBrowserVersion(browser);
    const engine = this.getEngine();
    const platform = this.getPlatform();
    const isMobile = this.isMobileDevice();

    return {
      name: browser,
      version,
      engine,
      platform,
      isMobile,
      supportsWebGL: this.supportsWebGL(),
      supportsWebP: this.supportsWebP(),
      supportsCSS: {
        grid: this.supportsCSSGrid(),
        flexbox: this.supportsCSSFlexbox(),
        customProperties: this.supportsCSSCustomProperties(),
        backdrop: this.supportsBackdropFilter(),
        clipPath: this.supportsClipPath()
      }
    };
  }

  private getBrowserName(): string {
    // Edge (Chromium-based)
    if (this.userAgent.includes('Edg/')) return 'Edge';
    
    // Chrome
    if (this.userAgent.includes('Chrome') && !this.userAgent.includes('Edg')) return 'Chrome';
    
    // Firefox
    if (this.userAgent.includes('Firefox')) return 'Firefox';
    
    // Safari
    if (this.userAgent.includes('Safari') && !this.userAgent.includes('Chrome')) return 'Safari';
    
    // Internet Explorer
    if (this.userAgent.includes('MSIE') || this.userAgent.includes('Trident')) return 'IE';
    
    return 'Unknown';
  }

  private getBrowserVersion(browserName: string): string {
    let version = 'Unknown';
    
    switch (browserName) {
      case 'Chrome':
        const chromeMatch = this.userAgent.match(/Chrome\/(\d+\.\d+)/);
        version = chromeMatch ? chromeMatch[1] : 'Unknown';
        break;
      case 'Firefox':
        const firefoxMatch = this.userAgent.match(/Firefox\/(\d+\.\d+)/);
        version = firefoxMatch ? firefoxMatch[1] : 'Unknown';
        break;
      case 'Safari':
        const safariMatch = this.userAgent.match(/Version\/(\d+\.\d+)/);
        version = safariMatch ? safariMatch[1] : 'Unknown';
        break;
      case 'Edge':
        const edgeMatch = this.userAgent.match(/Edg\/(\d+\.\d+)/);
        version = edgeMatch ? edgeMatch[1] : 'Unknown';
        break;
    }
    
    return version;
  }

  private getEngine(): string {
    if (this.userAgent.includes('WebKit')) return 'WebKit';
    if (this.userAgent.includes('Gecko')) return 'Gecko';
    if (this.userAgent.includes('Trident')) return 'Trident';
    return 'Unknown';
  }

  private getPlatform(): string {
    if (navigator.platform.includes('Win')) return 'Windows';
    if (navigator.platform.includes('Mac')) return 'macOS';
    if (navigator.platform.includes('Linux')) return 'Linux';
    if (/Android/.test(this.userAgent)) return 'Android';
    if (/iPhone|iPad|iPod/.test(this.userAgent)) return 'iOS';
    return 'Unknown';
  }

  private isMobileDevice(): boolean {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent);
  }

  private supportsWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  private supportsCSSGrid(): boolean {
    return CSS.supports('display', 'grid');
  }

  private supportsCSSFlexbox(): boolean {
    return CSS.supports('display', 'flex');
  }

  private supportsCSSCustomProperties(): boolean {
    return CSS.supports('--custom-property', 'value');
  }

  private supportsBackdropFilter(): boolean {
    return CSS.supports('backdrop-filter', 'blur(10px)') || 
           CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
  }

  private supportsClipPath(): boolean {
    return CSS.supports('clip-path', 'circle(50%)') ||
           CSS.supports('-webkit-clip-path', 'circle(50%)');
  }
}

/**
 * Feature Detection Utilities
 */
export class FeatureDetector {
  /**
   * Check if Intersection Observer is supported
   */
  static supportsIntersectionObserver(): boolean {
    return 'IntersectionObserver' in window;
  }

  /**
   * Check if ResizeObserver is supported
   */
  static supportsResizeObserver(): boolean {
    return 'ResizeObserver' in window;
  }

  /**
   * Check if Web Workers are supported
   */
  static supportsWebWorkers(): boolean {
    return typeof Worker !== 'undefined';
  }

  /**
   * Check if Service Workers are supported
   */
  static supportsServiceWorkers(): boolean {
    return 'serviceWorker' in navigator;
  }

  /**
   * Check if Local Storage is supported
   */
  static supportsLocalStorage(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if ES6 modules are supported
   */
  static supportsES6Modules(): boolean {
    const script = document.createElement('script');
    return 'noModule' in script;
  }

  /**
   * Check if CSS containment is supported
   */
  static supportsCSSContainment(): boolean {
    return CSS.supports('contain', 'layout');
  }

  /**
   * Check if CSS scroll-behavior is supported
   */
  static supportsSmoothScroll(): boolean {
    return CSS.supports('scroll-behavior', 'smooth');
  }
}
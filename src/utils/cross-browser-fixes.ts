/**
 * Cross-Browser Compatibility Fixes
 * Provides polyfills and workarounds for browser inconsistencies
 */

export class CrossBrowserFixes {
  /**
   * Initialize all cross-browser fixes
   */
  static init(): void {
    this.fixScrollBehavior();
    this.fixFocusVisible();
    this.fixViewportUnits();
    this.fixDateInputs();
    this.fixCustomProperties();
    this.addBrowserClasses();
  }

  /**
   * Fix smooth scroll behavior for browsers that don't support it
   */
  private static fixScrollBehavior(): void {
    if (!CSS.supports('scroll-behavior', 'smooth')) {
      // Polyfill for smooth scrolling
      const smoothScrollPolyfill = (target: Element, duration: number = 500) => {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime: number | null = null;

        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
          window.scrollTo(0, run);
          if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
      };

      // Override scroll behavior for anchor links
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          const targetId = target.getAttribute('href')?.substring(1);
          const targetElement = targetId ? document.getElementById(targetId) : null;
          if (targetElement) {
            smoothScrollPolyfill(targetElement);
          }
        }
      });
    }
  }

  /**
   * Easing function for smooth scroll polyfill
   */
  private static easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  /**
   * Fix focus-visible for browsers that don't support it
   */
  private static fixFocusVisible(): void {
    if (!CSS.supports('selector(:focus-visible)')) {
      let hadKeyboardEvent = true;
      const keyboardThrottleTimeout = 100;

      const focusTriggersKeyboardModality = (e: KeyboardEvent) => {
        if (e.metaKey || e.altKey || e.ctrlKey) return false;
        return true;
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (focusTriggersKeyboardModality(e)) {
          hadKeyboardEvent = true;
        }
      };

      const onPointerDown = () => {
        hadKeyboardEvent = false;
      };

      const onFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        if (hadKeyboardEvent || target.matches(':focus-visible')) {
          target.classList.add('focus-visible');
        }
      };

      const onBlur = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        target.classList.remove('focus-visible');
      };

      document.addEventListener('keydown', onKeyDown, true);
      document.addEventListener('mousedown', onPointerDown, true);
      document.addEventListener('pointerdown', onPointerDown, true);
      document.addEventListener('touchstart', onPointerDown, true);
      document.addEventListener('focus', onFocus, true);
      document.addEventListener('blur', onBlur, true);
    }
  }

  /**
   * Fix viewport units on mobile browsers
   */
  private static fixViewportUnits(): void {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
  }

  /**
   * Fix date input styling inconsistencies
   */
  private static fixDateInputs(): void {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach((input) => {
      const htmlInput = input as HTMLInputElement;
      
      // Add fallback for browsers that don't support date inputs
      if (htmlInput.type !== 'date') {
        htmlInput.type = 'text';
        htmlInput.placeholder = 'YYYY-MM-DD';
        htmlInput.pattern = '\\d{4}-\\d{2}-\\d{2}';
      }
    });
  }

  /**
   * Fix CSS custom properties for older browsers
   */
  private static fixCustomProperties(): void {
    if (!CSS.supports('--custom-property', 'value')) {
      // Fallback values for CSS custom properties
      const fallbacks = {
        '--primary-color': '#3b82f6',
        '--secondary-color': '#8b5cf6',
        '--background-color': '#000000',
        '--text-color': '#ffffff',
        '--border-color': '#374151'
      };

      Object.entries(fallbacks).forEach(([property, value]) => {
        const elements = document.querySelectorAll(`[style*="${property}"]`);
        elements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          const style = htmlElement.style.cssText;
          const regex = new RegExp(`var\\(${property}\\)`, 'g');
          htmlElement.style.cssText = style.replace(regex, value);
        });
      });
    }
  }

  /**
   * Add browser-specific classes to document
   */
  private static addBrowserClasses(): void {
    const detector = new (await import('./browser-detection')).BrowserDetector();
    const browserInfo = detector.detectBrowser();
    
    const classes = [
      `browser-${browserInfo.name.toLowerCase()}`,
      `engine-${browserInfo.engine.toLowerCase()}`,
      `platform-${browserInfo.platform.toLowerCase()}`,
      browserInfo.isMobile ? 'mobile' : 'desktop'
    ];

    // Add feature support classes
    if (!browserInfo.supportsWebGL) classes.push('no-webgl');
    if (!browserInfo.supportsWebP) classes.push('no-webp');
    if (!browserInfo.supportsCSS.grid) classes.push('no-css-grid');
    if (!browserInfo.supportsCSS.flexbox) classes.push('no-flexbox');

    document.documentElement.classList.add(...classes);
  }
}

/**
 * Safari-specific fixes
 */
export class SafariFixes {
  static init(): void {
    this.fixDateInputs();
    this.fixFlexboxGaps();
    this.fixBackdropFilter();
    this.fixScrolling();
  }

  private static fixDateInputs(): void {
    // Safari has issues with date input styling
    const style = document.createElement('style');
    style.textContent = `
      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
      input[type="date"]::-webkit-inner-spin-button,
      input[type="date"]::-webkit-clear-button {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  private static fixFlexboxGaps(): void {
    // Safari < 14.1 doesn't support gap in flexbox
    if (!CSS.supports('gap', '1rem')) {
      const style = document.createElement('style');
      style.textContent = `
        .flex.gap-4 > * + * { margin-left: 1rem; }
        .flex.flex-col.gap-4 > * + * { margin-top: 1rem; margin-left: 0; }
        .flex.gap-6 > * + * { margin-left: 1.5rem; }
        .flex.flex-col.gap-6 > * + * { margin-top: 1.5rem; margin-left: 0; }
      `;
      document.head.appendChild(style);
    }
  }

  private static fixBackdropFilter(): void {
    // Add -webkit- prefix for backdrop-filter
    const style = document.createElement('style');
    style.textContent = `
      .backdrop-blur {
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }
    `;
    document.head.appendChild(style);
  }

  private static fixScrolling(): void {
    // Fix momentum scrolling on iOS
    const style = document.createElement('style');
    style.textContent = `
      body, .scroll-container {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Firefox-specific fixes
 */
export class FirefoxFixes {
  static init(): void {
    this.fixScrollbarStyling();
    this.fixFlexboxShrinking();
    this.fixInputStyling();
  }

  private static fixScrollbarStyling(): void {
    // Firefox uses different scrollbar properties
    const style = document.createElement('style');
    style.textContent = `
      * {
        scrollbar-width: thin;
        scrollbar-color: #4b5563 #1f2937;
      }
    `;
    document.head.appendChild(style);
  }

  private static fixFlexboxShrinking(): void {
    // Firefox has different flex-shrink behavior
    const style = document.createElement('style');
    style.textContent = `
      .flex > * {
        min-width: 0;
        min-height: 0;
      }
    `;
    document.head.appendChild(style);
  }

  private static fixInputStyling(): void {
    // Firefox input styling fixes
    const style = document.createElement('style');
    style.textContent = `
      input[type="search"]::-moz-search-cancel-button {
        -moz-appearance: none;
      }
      input::-moz-focus-inner {
        border: 0;
        padding: 0;
      }
    `;
    document.head.appendChild(style);
  }
}
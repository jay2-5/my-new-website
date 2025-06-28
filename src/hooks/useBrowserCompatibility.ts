/**
 * React Hook for Browser Compatibility Checking
 * Provides real-time browser compatibility information
 */

import { useState, useEffect } from 'react';
import { BrowserDetector, FeatureDetector, type BrowserInfo } from '@/utils/browser-detection';
import { CrossBrowserFixes, SafariFixes, FirefoxFixes } from '@/utils/cross-browser-fixes';

interface CompatibilityStatus {
  isSupported: boolean;
  issues: string[];
  warnings: string[];
  browserInfo: BrowserInfo | null;
  performanceScore: number;
}

export function useBrowserCompatibility() {
  const [status, setStatus] = useState<CompatibilityStatus>({
    isSupported: true,
    issues: [],
    warnings: [],
    browserInfo: null,
    performanceScore: 100
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCompatibility = async () => {
      try {
        const detector = new BrowserDetector();
        const browserInfo = detector.detectBrowser();
        
        const issues: string[] = [];
        const warnings: string[] = [];
        let performanceScore = 100;

        // Check browser version
        const minVersions = {
          Chrome: 90,
          Firefox: 88,
          Safari: 14,
          Edge: 90
        };

        const currentVersion = parseInt(browserInfo.version);
        const minVersion = minVersions[browserInfo.name as keyof typeof minVersions];
        
        if (minVersion && currentVersion < minVersion) {
          issues.push(`Browser version ${browserInfo.version} is outdated. Minimum required: ${minVersion}`);
          performanceScore -= 30;
        }

        // Check critical features
        if (!browserInfo.supportsWebGL) {
          issues.push('WebGL not supported - 3D content will not display');
          performanceScore -= 25;
        }

        if (!browserInfo.supportsCSS.grid) {
          warnings.push('CSS Grid not supported - layout may differ');
          performanceScore -= 10;
        }

        if (!browserInfo.supportsCSS.flexbox) {
          issues.push('CSS Flexbox not supported - layout will be broken');
          performanceScore -= 20;
        }

        if (!FeatureDetector.supportsIntersectionObserver()) {
          warnings.push('Intersection Observer not supported - animations may not work');
          performanceScore -= 5;
        }

        if (!browserInfo.supportsWebP) {
          warnings.push('WebP not supported - images may load slower');
          performanceScore -= 5;
        }

        // Apply browser-specific fixes
        CrossBrowserFixes.init();
        
        if (browserInfo.name === 'Safari') {
          SafariFixes.init();
        } else if (browserInfo.name === 'Firefox') {
          FirefoxFixes.init();
        }

        setStatus({
          isSupported: issues.length === 0,
          issues,
          warnings,
          browserInfo,
          performanceScore: Math.max(0, performanceScore)
        });

      } catch (error) {
        console.error('Browser compatibility check failed:', error);
        setStatus(prev => ({
          ...prev,
          issues: ['Failed to check browser compatibility']
        }));
      } finally {
        setIsLoading(false);
      }
    };

    checkCompatibility();
  }, []);

  const refreshCheck = () => {
    setIsLoading(true);
    window.location.reload();
  };

  return {
    ...status,
    isLoading,
    refreshCheck
  };
}
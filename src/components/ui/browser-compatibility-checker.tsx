'use client'

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { BrowserDetector, FeatureDetector, type BrowserInfo } from '@/utils/browser-detection';

interface CompatibilityIssue {
  type: 'error' | 'warning' | 'info';
  feature: string;
  message: string;
  solution?: string;
}

export function BrowserCompatibilityChecker() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [issues, setIssues] = useState<CompatibilityIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const detector = new BrowserDetector();
    const info = detector.detectBrowser();
    setBrowserInfo(info);
    
    const detectedIssues = checkCompatibility(info);
    setIssues(detectedIssues);
    
    // Show checker if there are critical issues
    if (detectedIssues.some(issue => issue.type === 'error')) {
      setIsVisible(true);
    }
  }, []);

  const checkCompatibility = (info: BrowserInfo): CompatibilityIssue[] => {
    const issues: CompatibilityIssue[] = [];

    // Check for outdated browsers
    const minVersions = {
      Chrome: 90,
      Firefox: 88,
      Safari: 14,
      Edge: 90
    };

    const currentVersion = parseInt(info.version);
    const minVersion = minVersions[info.name as keyof typeof minVersions];
    
    if (minVersion && currentVersion < minVersion) {
      issues.push({
        type: 'error',
        feature: 'Browser Version',
        message: `Your ${info.name} version (${info.version}) is outdated. Some features may not work correctly.`,
        solution: `Please update to ${info.name} ${minVersion} or later for the best experience.`
      });
    }

    // Check WebGL support
    if (!info.supportsWebGL) {
      issues.push({
        type: 'error',
        feature: 'WebGL',
        message: '3D content may not display correctly without WebGL support.',
        solution: 'Enable hardware acceleration in your browser settings or update your graphics drivers.'
      });
    }

    // Check CSS Grid support
    if (!info.supportsCSS.grid) {
      issues.push({
        type: 'warning',
        feature: 'CSS Grid',
        message: 'Layout may appear different without CSS Grid support.',
        solution: 'Update your browser to a more recent version.'
      });
    }

    // Check CSS Custom Properties
    if (!info.supportsCSS.customProperties) {
      issues.push({
        type: 'warning',
        feature: 'CSS Custom Properties',
        message: 'Some styling features may not work without CSS custom properties.',
        solution: 'Update your browser for better CSS support.'
      });
    }

    // Check WebP support
    if (!info.supportsWebP) {
      issues.push({
        type: 'info',
        feature: 'WebP Images',
        message: 'Images may load slower without WebP support.',
        solution: 'Consider updating your browser for better image performance.'
      });
    }

    // Check Intersection Observer
    if (!FeatureDetector.supportsIntersectionObserver()) {
      issues.push({
        type: 'warning',
        feature: 'Intersection Observer',
        message: 'Some animations and lazy loading features may not work optimally.',
        solution: 'Update your browser for better performance features.'
      });
    }

    // Safari-specific checks
    if (info.name === 'Safari') {
      if (!info.supportsCSS.backdrop) {
        issues.push({
          type: 'info',
          feature: 'Backdrop Filter',
          message: 'Some visual effects may appear different in Safari.',
          solution: 'This is a known Safari limitation and will be fixed in future versions.'
        });
      }
    }

    // Firefox-specific checks
    if (info.name === 'Firefox') {
      issues.push({
        type: 'info',
        feature: 'Scrollbar Styling',
        message: 'Scrollbar appearance may differ in Firefox.',
        solution: 'This is expected behavior and does not affect functionality.'
      });
    }

    return issues;
  };

  const getIssueIcon = (type: CompatibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getIssueColor = (type: CompatibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-500 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500 bg-blue-500/10';
    }
  };

  if (!isVisible || !browserInfo) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 max-w-md"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-white font-semibold">Browser Compatibility</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close compatibility checker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-3">
          <p className="text-gray-300 text-sm">
            {browserInfo.name} {browserInfo.version} on {browserInfo.platform}
          </p>
          {issues.length === 0 ? (
            <p className="text-green-400 text-sm mt-1">
              ✓ Your browser is fully compatible
            </p>
          ) : (
            <p className="text-gray-300 text-sm mt-1">
              {issues.length} compatibility {issues.length === 1 ? 'issue' : 'issues'} detected
            </p>
          )}
        </div>

        {issues.length > 0 && (
          <>
            <div className="space-y-2 mb-3">
              {issues.slice(0, showDetails ? issues.length : 2).map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getIssueColor(issue.type)}`}
                >
                  <div className="flex items-start space-x-2">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">
                        {issue.feature}
                      </p>
                      <p className="text-gray-300 text-xs mt-1">
                        {issue.message}
                      </p>
                      {issue.solution && showDetails && (
                        <p className="text-gray-400 text-xs mt-2">
                          <strong>Solution:</strong> {issue.solution}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {issues.length > 2 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {showDetails ? 'Show Less' : `Show ${issues.length - 2} More`}
              </button>
            )}
          </>
        )}

        <div className="mt-3 pt-3 border-t border-gray-700">
          <button
            onClick={() => window.location.reload()}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
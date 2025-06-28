import React, { useState, useEffect } from 'react';
import { Zap, Calendar } from 'lucide-react';
import { SplineSceneBasic } from '@/components/ui/demo';
import { ServicesCarousel } from '@/components/ui/services-carousel';
import { ConsultationPage } from '@/components/ui/consultation-page';
import { NotFoundPage } from '@/components/ui/404-page';
import { BrowserCompatibilityChecker } from '@/components/ui/browser-compatibility-checker';
import { PerformanceMonitor } from '@/utils/performance-monitor';
import { useAnalytics } from '@/hooks/useAnalytics';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'consultation' | '404'>('home');
  
  // Initialize analytics with all tracking features
  const {
    trackButtonClick,
    trackEvent,
    trackError
  } = useAnalytics({
    trackPageViews: true,
    trackScrollDepth: true,
    trackEngagement: true,
    trackPerformance: true
  });

  useEffect(() => {
    // Initialize performance monitoring
    const monitor = new PerformanceMonitor();
    
    // Log performance report after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        monitor.logReport();
      }, 2000);
    });

    // Track any JavaScript errors
    window.addEventListener('error', (event) => {
      trackError(event.message, 'javascript_error', false);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      trackError(event.reason?.toString() || 'Unhandled promise rejection', 'promise_rejection', false);
    });

    // Cleanup on unmount
    return () => {
      monitor.cleanup();
    };
  }, [trackError]);

  const handleBookConsultation = () => {
    // Track button click
    trackButtonClick('book_consultation', 'hero_section');
    
    setCurrentPage('consultation');
    // Scroll to top when opening consultation page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    // Track navigation
    trackEvent({
      action: 'navigate',
      category: 'navigation',
      label: 'back_to_home'
    });
    
    setCurrentPage('home');
    // Scroll to top when returning to home page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShow404 = () => {
    // Track 404 page view (for demo purposes)
    trackEvent({
      action: 'view_404',
      category: 'navigation',
      label: 'demo_404'
    });
    
    setCurrentPage('404');
    // Scroll to top when showing 404 page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'consultation') {
    return <ConsultationPage onBack={handleBackToHome} />;
  }

  if (currentPage === '404') {
    return (
      <NotFoundPage 
        onNavigateHome={handleBackToHome}
        onNavigateConsultation={handleBookConsultation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Browser Compatibility Checker */}
      <BrowserCompatibilityChecker />

      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header 
        className="relative z-10 px-4 md:px-6 py-6 md:py-8"
        role="banner"
        aria-label="Site header"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              role="img"
              aria-label="Starvico logo"
            >
              <Zap 
                className="w-4 h-4 md:w-6 md:h-6 text-white" 
                aria-hidden="true"
                focusable="false"
              />
            </div>
            <h1 
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
              aria-label="Starvico - AI Automation Agency"
            >
              Starvico
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" role="main" aria-label="Main content">
        {/* Hero Section with 3D Component */}
        <section 
          className="relative px-4 md:px-6 py-8 md:py-12"
          aria-labelledby="hero-heading"
          role="region"
        >
          <div className="max-w-7xl mx-auto">
            <SplineSceneBasic />
          </div>
        </section>

        {/* Services Section */}
        <section 
          className="px-4 md:px-6 py-16 md:py-20"
          aria-labelledby="services-heading"
          role="region"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h3 
                id="services-heading"
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white"
              >
                Our Services
              </h3>
              <div 
                className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto"
                role="presentation"
                aria-hidden="true"
              ></div>
            </div>
            
            <ServicesCarousel />

            {/* Pricing Text - Improved contrast */}
            <div className="text-center mt-8 md:mt-12">
              <p 
                className="text-gray-100 font-bold text-lg md:text-xl lg:text-2xl"
                role="text"
                aria-label="Pricing information: We will do everything else, if you are ready to pay as much as we ask"
              >
                <span className="block md:inline">We will do everything else, if you are</span>
                <span className="block md:inline md:ml-1">ready to pay as much as we ask.</span>
              </p>
            </div>

            {/* Book Consultation Button - Enhanced for better accessibility */}
            <div className="text-center mt-12 md:mt-16">
              <button
                onClick={handleBookConsultation}
                className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 text-lg md:text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Book a consultation to discuss your AI automation needs"
                aria-describedby="consultation-description"
                type="button"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                ></div>
                <div className="relative flex items-center space-x-3">
                  <Calendar 
                    className="w-6 h-6 md:w-7 md:h-7" 
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span>Book a Consultation</span>
                </div>
                <div 
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:translate-x-full"
                  aria-hidden="true"
                ></div>
              </button>
              <p 
                id="consultation-description"
                className="mt-4 text-gray-200 text-sm md:text-base"
                role="text"
              >
                Ready to transform your business? Let's discuss your AI automation needs.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer 
        className="px-4 md:px-6 py-8 md:py-12 border-t border-gray-700"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div 
              className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              role="img"
              aria-label="Starvico logo"
            >
              <Zap 
                className="w-3 h-3 md:w-4 md:h-4 text-white" 
                aria-hidden="true"
                focusable="false"
              />
            </div>
            <span 
              className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
              aria-label="Starvico"
            >
              Starvico
            </span>
          </div>
          <p 
            className="text-gray-300 text-sm md:text-base"
            role="text"
          >
            © 2025 Starvico. Powering the future with AI automation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
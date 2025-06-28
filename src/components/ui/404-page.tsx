'use client'

import React, { useState } from 'react';
import { Home, Search, ArrowLeft, Bot, Phone, MessageSquare, Users, Zap, AlertTriangle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome?: () => void;
  onNavigateConsultation?: () => void;
}

export function NotFoundPage({ onNavigateHome, onNavigateConsultation }: NotFoundPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search functionality - in a real app, this would connect to your search API
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search results based on your site content
    const mockResults = [
      'AI Chat Assistants - Intelligent conversational AI for 24/7 customer engagement',
      'AI Phone Callers - Automated voice systems with natural speech',
      'Automated Outreach Systems - Smart campaigns with personalized messaging',
      'AI Social Agents - Automated social media management',
      'Book a Consultation - Schedule a meeting with our AI experts',
      'Home - Main page with all our AI automation services'
    ].filter(result => 
      result.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleQuickNavigation = (section: string) => {
    if (section === 'home' && onNavigateHome) {
      onNavigateHome();
    } else if (section === 'consultation' && onNavigateConsultation) {
      onNavigateConsultation();
    }
    // In a real app, you might use React Router or Next.js router here
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
        className="relative z-10 px-4 md:px-6 py-6 md:py-8 border-b border-gray-700"
        role="banner"
        aria-label="404 error page header"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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

          {/* Quick Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-6"
            role="navigation"
            aria-label="Quick navigation"
          >
            <button
              onClick={() => handleQuickNavigation('home')}
              className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-3 py-2"
              aria-label="Go to homepage"
            >
              Home
            </button>
            <button
              onClick={() => handleQuickNavigation('consultation')}
              className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg px-3 py-2"
              aria-label="Book a consultation"
            >
              Consultation
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main 
        id="main-content"
        className="px-4 md:px-6 py-12 md:py-20"
        role="main"
        aria-label="404 error page content"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Error Display */}
          <div className="mb-8 md:mb-12">
            <div 
              className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full border border-red-500/30 mb-6 md:mb-8"
              role="img"
              aria-label="404 error icon"
            >
              <AlertTriangle 
                className="w-12 h-12 md:w-16 md:h-16 text-red-400" 
                aria-hidden="true"
                focusable="false"
              />
            </div>
            
            <h2 
              className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4"
              aria-label="Error 404"
            >
              404
            </h2>
            
            <h3 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4"
              id="error-heading"
            >
              Oops! Page Not Found
            </h3>
            
            <p 
              className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              role="text"
              aria-describedby="error-heading"
            >
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry though – our AI hasn't become sentient and hidden it from you!
            </p>
          </div>

          {/* Search Section */}
          <div 
            className="mb-12 md:mb-16"
            role="region"
            aria-labelledby="search-heading"
          >
            <h4 
              id="search-heading"
              className="text-xl md:text-2xl font-bold text-white mb-6"
            >
              Search Our Site
            </h4>
            
            <form 
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto"
              role="search"
              aria-label="Site search"
            >
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for AI services, consultation, or help..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-colors duration-200"
                  aria-label="Search our website"
                  aria-describedby="search-help"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-r-xl"
                  aria-label={isSearching ? 'Searching...' : 'Search'}
                >
                  {isSearching ? (
                    <div 
                      className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
              <p 
                id="search-help"
                className="mt-2 text-sm text-gray-400 text-left"
              >
                Try searching for "AI chat", "consultation", "automation", or "services"
              </p>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div 
                className="mt-6 max-w-2xl mx-auto"
                role="region"
                aria-label="Search results"
                aria-live="polite"
              >
                <h5 className="text-lg font-semibold text-white mb-4 text-left">
                  Search Results ({searchResults.length})
                </h5>
                <ul className="space-y-3 text-left">
                  {searchResults.map((result, index) => (
                    <li 
                      key={index}
                      className="p-4 bg-gray-800 border border-gray-600 rounded-lg hover:border-blue-400 transition-colors duration-200"
                    >
                      <button
                        onClick={() => {
                          // In a real app, navigate to the actual page
                          if (result.includes('Home')) {
                            handleQuickNavigation('home');
                          } else if (result.includes('Consultation')) {
                            handleQuickNavigation('consultation');
                          }
                        }}
                        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
                        aria-label={`Go to ${result.split(' - ')[0]}`}
                      >
                        <div className="text-blue-300 font-medium">
                          {result.split(' - ')[0]}
                        </div>
                        {result.includes(' - ') && (
                          <div className="text-gray-300 text-sm mt-1">
                            {result.split(' - ')[1]}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !isSearching && (
              <div 
                className="mt-6 p-4 bg-gray-800 border border-gray-600 rounded-lg max-w-2xl mx-auto"
                role="status"
                aria-live="polite"
              >
                <p className="text-gray-300">
                  No results found for "{searchQuery}". Try different keywords or browse our main sections below.
                </p>
              </div>
            )}
          </div>

          {/* Quick Navigation Cards */}
          <div 
            className="mb-12 md:mb-16"
            role="region"
            aria-labelledby="navigation-heading"
          >
            <h4 
              id="navigation-heading"
              className="text-xl md:text-2xl font-bold text-white mb-8"
            >
              Where would you like to go?
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Home Card */}
              <button
                onClick={() => handleQuickNavigation('home')}
                className="group p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl hover:border-blue-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Go to homepage"
              >
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto"
                  role="img"
                  aria-label="Home icon"
                >
                  <Home 
                    className="w-6 h-6 text-white" 
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
                <h5 className="text-lg font-bold text-white mb-2">Homepage</h5>
                <p className="text-gray-300 text-sm">
                  Return to our main page and explore all AI automation services
                </p>
              </button>

              {/* AI Services Card */}
              <div className="group p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl">
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto"
                  role="img"
                  aria-label="AI services icon"
                >
                  <Bot 
                    className="w-6 h-6 text-white" 
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
                <h5 className="text-lg font-bold text-white mb-2">AI Services</h5>
                <div className="space-y-2 text-left">
                  <button
                    onClick={() => handleQuickNavigation('home')}
                    className="block w-full text-left text-sm text-blue-300 hover:text-blue-200 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-2 py-1"
                    aria-label="Learn about AI Chat Assistants"
                  >
                    • AI Chat Assistants
                  </button>
                  <button
                    onClick={() => handleQuickNavigation('home')}
                    className="block w-full text-left text-sm text-blue-300 hover:text-blue-200 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-2 py-1"
                    aria-label="Learn about AI Phone Callers"
                  >
                    • AI Phone Callers
                  </button>
                  <button
                    onClick={() => handleQuickNavigation('home')}
                    className="block w-full text-left text-sm text-blue-300 hover:text-blue-200 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-2 py-1"
                    aria-label="Learn about Automated Outreach"
                  >
                    • Automated Outreach
                  </button>
                  <button
                    onClick={() => handleQuickNavigation('home')}
                    className="block w-full text-left text-sm text-blue-300 hover:text-blue-200 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-2 py-1"
                    aria-label="Learn about AI Social Agents"
                  >
                    • AI Social Agents
                  </button>
                </div>
              </div>

              {/* Consultation Card */}
              <button
                onClick={() => handleQuickNavigation('consultation')}
                className="group p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl hover:border-purple-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                aria-label="Book a consultation"
              >
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto"
                  role="img"
                  aria-label="Consultation icon"
                >
                  <MessageSquare 
                    className="w-6 h-6 text-white" 
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
                <h5 className="text-lg font-bold text-white mb-2">Book Consultation</h5>
                <p className="text-gray-300 text-sm">
                  Schedule a meeting to discuss your AI automation needs
                </p>
              </button>

              {/* Help Card */}
              <div className="group p-6 bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl">
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 mx-auto"
                  role="img"
                  aria-label="Help icon"
                >
                  <Users 
                    className="w-6 h-6 text-white" 
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
                <h5 className="text-lg font-bold text-white mb-2">Need Help?</h5>
                <p className="text-gray-300 text-sm mb-3">
                  Can't find what you're looking for?
                </p>
                <button
                  onClick={() => handleQuickNavigation('consultation')}
                  className="text-orange-300 hover:text-orange-200 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-orange-500/50 rounded px-2 py-1"
                  aria-label="Contact us for help"
                >
                  Contact Us →
                </button>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center">
            <button
              onClick={() => handleQuickNavigation('home')}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Return to homepage"
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              ></div>
              <div className="relative flex items-center space-x-3">
                <ArrowLeft 
                  className="w-6 h-6" 
                  aria-hidden="true"
                  focusable="false"
                />
                <span>Take Me Home</span>
              </div>
            </button>
          </div>
        </div>
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
            © 2025 Starvico. Even our 404 pages are powered by thoughtful design.
          </p>
        </div>
      </footer>
    </div>
  );
}
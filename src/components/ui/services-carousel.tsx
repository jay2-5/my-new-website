'use client'

import React, { useState, useEffect } from 'react';
import { Bot, Phone, Mail, Users } from 'lucide-react';

const services = [
  {
    icon: Bot,
    title: 'AI Chat Assistants',
    description: 'Intelligent conversational AI that engages customers 24/7 with human-like interactions.'
  },
  {
    icon: Phone,
    title: 'AI Phone Callers',
    description: 'Automated voice systems that handle calls with natural speech and professional efficiency.'
  },
  {
    icon: Mail,
    title: 'Automated Outreach Systems',
    description: 'Smart campaigns that reach prospects at scale with personalized messaging.'
  },
  {
    icon: Users,
    title: 'AI Social Agents',
    description: 'AI Agents that consistently increase a brand\'s presence on social media.'
  }
];

export function ServicesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Desktop View - Single Row */}
      <div 
        className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8"
        role="region"
        aria-label="AI automation services"
      >
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-6 hover:border-blue-400 transition-all duration-500 hover:transform hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500/50"
              tabIndex={0}
              role="article"
              aria-labelledby={`service-${index}-title`}
              aria-describedby={`service-${index}-description`}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
              ></div>
              <div className="relative z-10 text-center">
                <div 
                  className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto"
                  role="img"
                  aria-label={`${service.title} icon`}
                >
                  <IconComponent 
                    className="w-6 h-6 lg:w-8 lg:h-8 text-white" 
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
                <h4 
                  id={`service-${index}-title`}
                  className="text-lg lg:text-xl xl:text-2xl font-bold mb-3 lg:mb-4 text-white group-hover:text-blue-100 transition-colors duration-300"
                >
                  {service.title}
                </h4>
                <p 
                  id={`service-${index}-description`}
                  className="text-gray-200 text-sm lg:text-base leading-relaxed group-hover:text-gray-100 transition-colors duration-300"
                >
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View - Carousel */}
      <div 
        className="md:hidden relative"
        role="region"
        aria-label="AI automation services carousel"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            role="group"
            aria-label={`Service ${currentIndex + 1} of ${services.length}`}
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-2"
                  role="tabpanel"
                  aria-labelledby={`carousel-tab-${index}`}
                  aria-hidden={index !== currentIndex}
                  tabIndex={index === currentIndex ? 0 : -1}
                >
                  <div className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-6 hover:border-blue-400 transition-all duration-500">
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      aria-hidden="true"
                    ></div>
                    <div className="relative z-10 text-center">
                      <div 
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto"
                        role="img"
                        aria-label={`${service.title} icon`}
                      >
                        <IconComponent 
                          className="w-8 h-8 text-white" 
                          aria-hidden="true"
                          focusable="false"
                        />
                      </div>
                      <h4 
                        className="text-2xl font-bold mb-4 text-white group-hover:text-blue-100 transition-colors duration-300"
                        id={`mobile-service-${index}-title`}
                      >
                        {service.title}
                      </h4>
                      <p 
                        className="text-gray-200 text-base leading-relaxed group-hover:text-gray-100 transition-colors duration-300"
                        id={`mobile-service-${index}-description`}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Indicators - Improved contrast and accessibility */}
        <div 
          className="flex justify-center mt-6 space-x-2"
          role="tablist"
          aria-label="Service carousel navigation"
        >
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black ${
                index === currentIndex 
                  ? 'bg-blue-400 w-8' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-controls={`carousel-panel-${index}`}
              aria-label={`Go to ${service.title} slide`}
              id={`carousel-tab-${index}`}
              tabIndex={index === currentIndex ? 0 : -1}
            />
          ))}
        </div>

        {/* Screen reader announcement for current slide */}
        <div 
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing slide {currentIndex + 1} of {services.length}: {services[currentIndex].title}
        </div>
      </div>
    </>
  );
}
'use client'

import React, { useState } from 'react';
import { ArrowLeft, User, Building, Mail, Bot, Phone, MessageSquare, Users, Plus, Zap, AlertCircle, CheckCircle, Loader2, Home, Calendar } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ConsultationPageProps {
  onBack: () => void;
}

interface FormData {
  name: string;
  businessName: string;
  email: string;
  interestedServices: string[];
  otherService: string;
  problems: string;
  description: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  interestedServices?: string;
  problems?: string;
  otherService?: string;
  general?: string;
}

interface FieldValidation {
  isValid: boolean;
  error?: string;
  touched: boolean;
}

const serviceOptions = [
  { value: 'ai-chat-assistant', label: 'AI Chat Assistant', icon: Bot },
  { value: 'ai-phone-caller', label: 'AI Phone Caller', icon: Phone },
  { value: 'automated-outreach-system', label: 'Automated Outreach System', icon: MessageSquare },
  { value: 'ai-social-agent', label: 'AI Social Agent', icon: Users },
  { value: 'others', label: 'Others', icon: Plus }
];

export function ConsultationPage({ onBack }: ConsultationPageProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    businessName: '',
    email: '',
    interestedServices: [],
    otherService: '',
    problems: '',
    description: ''
  });

  const [fieldValidation, setFieldValidation] = useState<Record<string, FieldValidation>>({
    name: { isValid: true, touched: false },
    email: { isValid: true, touched: false },
    interestedServices: { isValid: true, touched: false },
    problems: { isValid: true, touched: false },
    otherService: { isValid: true, touched: false }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize analytics
  const {
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackButtonClick,
    trackEvent
  } = useAnalytics();

  // Track form start when component mounts
  React.useEffect(() => {
    trackFormStart('consultation_form');
  }, [trackFormStart]);

  const validateField = (fieldName: string, value: any): FieldValidation => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          return { isValid: false, error: 'Name is required', touched: true };
        }
        if (value.trim().length < 2) {
          return { isValid: false, error: 'Name must be at least 2 characters long', touched: true };
        }
        if (value.trim().length > 100) {
          return { isValid: false, error: 'Name must be less than 100 characters', touched: true };
        }
        return { isValid: true, touched: true };

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          return { isValid: false, error: 'Email address is required', touched: true };
        }
        if (!emailRegex.test(value)) {
          return { isValid: false, error: 'Please enter a valid email address (e.g., name@example.com)', touched: true };
        }
        if (value.length > 100) {
          return { isValid: false, error: 'Email address must be less than 100 characters', touched: true };
        }
        return { isValid: true, touched: true };

      case 'interestedServices':
        if (!Array.isArray(value) || value.length === 0) {
          return { isValid: false, error: 'Please select at least one service you\'re interested in', touched: true };
        }
        if (value.length > 10) {
          return { isValid: false, error: 'Please select no more than 10 services', touched: true };
        }
        return { isValid: true, touched: true };

      case 'otherService':
        if (formData.interestedServices.includes('others')) {
          if (!value.trim()) {
            return { isValid: false, error: 'Please describe the specific service you need', touched: true };
          }
          if (value.trim().length < 10) {
            return { isValid: false, error: 'Please provide at least 10 characters describing the service', touched: true };
          }
          if (value.length > 500) {
            return { isValid: false, error: 'Description must be less than 500 characters', touched: true };
          }
        }
        return { isValid: true, touched: true };

      case 'problems':
        if (!value.trim()) {
          return { isValid: false, error: 'Please describe the problems you want to solve', touched: true };
        }
        if (value.trim().length < 30) {
          return { isValid: false, error: `Please provide at least 30 characters (currently ${value.trim().length})`, touched: true };
        }
        if (value.length > 2000) {
          return { isValid: false, error: 'Description must be less than 2000 characters', touched: true };
        }
        return { isValid: true, touched: true };

      default:
        return { isValid: true, touched: true };
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear any previous submit errors
    setSubmitError(null);
    
    // Validate field on change if it's been touched or if submit was attempted
    if (fieldValidation[fieldName]?.touched || submitAttempted) {
      const validation = validateField(fieldName, value);
      setFieldValidation(prev => ({
        ...prev,
        [fieldName]: validation
      }));
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    const value = fieldName === 'interestedServices' ? formData.interestedServices : formData[fieldName as keyof FormData];
    const validation = validateField(fieldName, value);
    setFieldValidation(prev => ({
      ...prev,
      [fieldName]: validation
    }));
  };

  const validateAllFields = (): boolean => {
    const validations: Record<string, FieldValidation> = {};
    let isFormValid = true;

    // Validate all required fields
    const fieldsToValidate = ['name', 'email', 'interestedServices', 'problems'];
    
    // Add otherService validation if 'others' is selected
    if (formData.interestedServices.includes('others')) {
      fieldsToValidate.push('otherService');
    }

    fieldsToValidate.forEach(fieldName => {
      const value = fieldName === 'interestedServices' ? formData.interestedServices : formData[fieldName as keyof FormData];
      const validation = validateField(fieldName, value);
      validations[fieldName] = validation;
      if (!validation.isValid) {
        isFormValid = false;
      }
    });

    setFieldValidation(prev => ({ ...prev, ...validations }));
    return isFormValid;
  };

  const handleServiceToggle = (serviceValue: string) => {
    const newServices = formData.interestedServices.includes(serviceValue)
      ? formData.interestedServices.filter(s => s !== serviceValue)
      : [...formData.interestedServices, serviceValue];

    handleFieldChange('interestedServices', newServices);

    // Track service selection
    trackEvent({
      action: 'service_selection',
      category: 'form_interaction',
      label: serviceValue,
      custom_parameters: {
        selected: !formData.interestedServices.includes(serviceValue),
        total_selected: newServices.length
      }
    });

    // Clear otherService if 'others' is deselected
    if (serviceValue === 'others' && formData.interestedServices.includes('others')) {
      handleFieldChange('otherService', '');
    }
  };

  const handleReset = () => {
    // Track form reset
    trackButtonClick('form_reset', 'consultation_form');
    
    // Clear all form data
    setFormData({
      name: '',
      businessName: '',
      email: '',
      interestedServices: [],
      otherService: '',
      problems: '',
      description: ''
    });
    
    // Clear all validation states
    setFieldValidation({
      name: { isValid: true, touched: false },
      email: { isValid: true, touched: false },
      interestedServices: { isValid: true, touched: false },
      problems: { isValid: true, touched: false },
      otherService: { isValid: true, touched: false }
    });
    
    setSubmitAttempted(false);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError(null);
    
    if (!validateAllFields()) {
      // Track form validation errors
      const errors = Object.entries(fieldValidation)
        .filter(([_, validation]) => !validation.isValid)
        .map(([field, _]) => field);
      
      trackFormError('consultation_form', `validation_errors: ${errors.join(', ')}`);
      
      // Focus on first invalid field
      const firstInvalidField = Object.keys(fieldValidation).find(
        key => fieldValidation[key] && !fieldValidation[key].isValid
      );
      if (firstInvalidField) {
        const element = document.getElementById(firstInvalidField);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      console.log('Form submitted:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Track successful form submission
      trackFormSubmit('consultation_form');
      
      // Track additional submission details
      trackEvent({
        action: 'consultation_submitted',
        category: 'lead_generation',
        label: 'consultation_form',
        custom_parameters: {
          services_selected: formData.interestedServices.length,
          has_business_name: !!formData.businessName,
          problems_length: formData.problems.length,
          description_length: formData.description.length
        }
      });
      
      // Show success state
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      
      // Set user-friendly error message
      let errorMessage = 'There was an error submitting your request. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      
      // Track submission error
      trackFormError('consultation_form', error instanceof Error ? error.message : 'submission_failed');
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldStatus = (fieldName: string) => {
    const validation = fieldValidation[fieldName];
    if (!validation?.touched && !submitAttempted) return 'neutral';
    return validation?.isValid ? 'valid' : 'invalid';
  };

  const getFieldClasses = (fieldName: string, baseClasses: string) => {
    const status = getFieldStatus(fieldName);
    const statusClasses = {
      neutral: 'border-gray-600 focus:border-blue-400 focus:ring-blue-400',
      valid: 'border-green-500 focus:border-green-400 focus:ring-green-400',
      invalid: 'border-red-500 focus:border-red-400 focus:ring-red-400'
    };
    return `${baseClasses} ${statusClasses[status]}`;
  };

  // Show success message - now permanent with back button
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header with back button */}
        <header 
          className="relative z-10 px-4 md:px-6 py-6 md:py-8 border-b border-gray-700"
          role="banner"
          aria-label="Success page header"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <nav 
              className="flex items-center space-x-4"
              role="navigation"
              aria-label="Navigation"
            >
              <button
                onClick={() => {
                  trackButtonClick('back_to_home', 'success_page');
                  onBack();
                }}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Go back to home page"
                type="button"
              >
                <ArrowLeft 
                  className="w-5 h-5" 
                  aria-hidden="true"
                  focusable="false"
                />
              </button>
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
            </nav>
          </div>
        </header>

        {/* Success Content */}
        <main className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
          <div className="text-center max-w-2xl mx-auto">
            {/* Success Icon with Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/25">
                <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-white animate-pulse" />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-2 border-green-400/30 animate-ping"></div>
              <div className="absolute inset-2 w-20 h-20 md:w-28 md:h-28 mx-auto rounded-full border border-green-400/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Thank You!
            </h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-xl md:text-2xl text-white font-semibold">
                Your consultation request has been submitted successfully.
              </p>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed">
                We'll get back to you within 24 hours to discuss your AI automation needs and schedule your consultation.
              </p>
            </div>

            {/* What happens next section */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-6 md:p-8 mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center justify-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span>What happens next?</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Review</h4>
                    <p className="text-gray-300 text-sm">Our team reviews your requirements and prepares a customized solution.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Contact</h4>
                    <p className="text-gray-300 text-sm">We'll reach out via email to schedule your consultation call.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Consultation</h4>
                    <p className="text-gray-300 text-sm">We discuss your needs and present tailored AI automation solutions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  trackButtonClick('back_to_home_main', 'success_page');
                  onBack();
                }}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Return to homepage"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                ></div>
                <div className="relative flex items-center space-x-3">
                  <Home 
                    className="w-6 h-6" 
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span>Back to Home</span>
                </div>
              </button>

              <button
                onClick={() => {
                  trackButtonClick('submit_another', 'success_page');
                  setSubmitSuccess(false);
                  handleReset();
                }}
                className="px-8 py-4 text-lg font-semibold text-gray-200 border-2 border-gray-600 rounded-2xl hover:border-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                aria-label="Submit another consultation request"
              >
                Submit Another Request
              </button>
            </div>

            {/* Contact info */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Questions? Feel free to reach out to us directly.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#consultation-form" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Skip to consultation form"
      >
        Skip to consultation form
      </a>

      {/* Header */}
      <header 
        className="relative z-10 px-4 md:px-6 py-6 md:py-8 border-b border-gray-700"
        role="banner"
        aria-label="Consultation page header"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <nav 
            className="flex items-center space-x-4"
            role="navigation"
            aria-label="Breadcrumb navigation"
          >
            <button
              onClick={() => {
                trackButtonClick('back_to_home', 'consultation_header');
                onBack();
              }}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Go back to home page"
              type="button"
            >
              <ArrowLeft 
                className="w-5 h-5" 
                aria-hidden="true"
                focusable="false"
              />
            </button>
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
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main 
        className="px-4 md:px-6 py-8 md:py-12"
        role="main"
        aria-label="Consultation booking form"
      >
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8 md:mb-12">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
              id="consultation-heading"
            >
              Book a Consultation
            </h2>
            <p 
              className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto"
              role="text"
            >
              Tell us about your needs and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div 
              className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-300 font-medium mb-1">Submission Error</h3>
                  <p className="text-red-200 text-sm">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Container */}
          <div 
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl"
            role="region"
            aria-labelledby="consultation-heading"
          >
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              id="consultation-form"
              noValidate
              aria-label="Consultation booking form"
            >
              {/* Name Field */}
              <div role="group" aria-labelledby="name-label">
                <label 
                  htmlFor="name" 
                  id="name-label"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2"
                >
                  <User 
                    className="w-4 h-4" 
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span>Your Name *</span>
                  {getFieldStatus('name') === 'valid' && (
                    <CheckCircle 
                      className="w-4 h-4 text-green-400" 
                      aria-hidden="true"
                      focusable="false"
                    />
                  )}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  className={getFieldClasses('name', 'w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-300 transition-colors duration-200')}
                  placeholder="Enter your name"
                  aria-required="true"
                  aria-invalid={getFieldStatus('name') === 'invalid'}
                  aria-describedby={`name-help ${getFieldStatus('name') === 'invalid' ? 'name-error' : ''}`}
                />
                <div id="name-help" className="sr-only">
                  Enter your full name or first name. This field is required and must be between 2 and 100 characters.
                </div>
                {getFieldStatus('name') === 'invalid' && fieldValidation.name?.error && (
                  <div 
                    id="name-error"
                    className="mt-2 flex items-start space-x-2 text-sm text-red-300"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle 
                      className="w-4 h-4 mt-0.5 flex-shrink-0" 
                      aria-hidden="true"
                      focusable="false"
                    />
                    <span>{fieldValidation.name.error}</span>
                  </div>
                )}
              </div>

              {/* Business Name Field */}
              <div role="group" aria-labelledby="business-label">
                <label 
                  htmlFor="businessName" 
                  id="business-label"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2"
                >
                  <Building 
                    className="w-4 h-4" 
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span>Business Name</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleFieldChange('businessName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors duration-200"
                  placeholder="Enter your business name"
                  aria-describedby="business-help"
                />
                <div id="business-help" className="mt-1 text-xs text-gray-400">
                  Optional: Your business or company name
                </div>
              </div>

              {/* Email Field */}
              <div role="group" aria-labelledby="email-label">
                <label 
                  htmlFor="email" 
                  id="email-label"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2"
                >
                  <Mail 
                    className="w-4 h-4" 
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span>Email Address *</span>
                  {getFieldStatus('email') === 'valid' && (
                    <CheckCircle 
                      className="w-4 h-4 text-green-400" 
                      aria-hidden="true"
                      focusable="false"
                    />
                  )}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  className={getFieldClasses('email', 'w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-300 transition-colors duration-200')}
                  placeholder="Enter your email address"
                  aria-required="true"
                  aria-invalid={getFieldStatus('email') === 'invalid'}
                  aria-describedby={`email-help ${getFieldStatus('email') === 'invalid' ? 'email-error' : ''}`}
                />
                <div id="email-help" className="mt-1 text-xs text-gray-400">
                  We'll use this email to contact you about your consultation
                </div>
                {getFieldStatus('email') === 'invalid' && fieldValidation.email?.error && (
                  <div 
                    id="email-error"
                    className="mt-2 flex items-start space-x-2 text-sm text-red-300"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle 
                      className="w-4 h-4 mt-0.5 flex-shrink-0" 
                      aria-hidden="true"
                      focusable="false"
                    />
                    <span>{fieldValidation.email.error}</span>
                  </div>
                )}
              </div>

              {/* Interested Services */}
              <fieldset 
                role="group" 
                aria-labelledby="services-legend"
                aria-required="true"
                aria-invalid={getFieldStatus('interestedServices') === 'invalid'}
                aria-describedby={`services-help ${getFieldStatus('interestedServices') === 'invalid' ? 'services-error' : ''}`}
              >
                <legend 
                  id="services-legend"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-3"
                >
                  <span>Interested Services * (Select all that apply)</span>
                  {getFieldStatus('interestedServices') === 'valid' && (
                    <CheckCircle 
                      className="w-4 h-4 text-green-400" 
                      aria-hidden="true"
                      focusable="false"
                    />
                  )}
                </legend>
                <div id="services-help" className="mb-3 text-xs text-gray-400">
                  Choose one or more AI automation services you're interested in
                </div>
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  role="group"
                  aria-labelledby="services-legend"
                  onBlur={() => handleFieldBlur('interestedServices')}
                >
                  {serviceOptions.map((service) => {
                    const IconComponent = service.icon;
                    const isSelected = formData.interestedServices.includes(service.value);
                    
                    return (
                      <button
                        key={service.value}
                        type="button"
                        onClick={() => handleServiceToggle(service.value)}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-400 text-blue-200'
                            : 'bg-gray-800 border-gray-600 text-gray-200 hover:border-gray-500'
                        }`}
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-labelledby={`service-${service.value}-label`}
                        aria-describedby={`service-${service.value}-desc`}
                      >
                        <IconComponent 
                          className="w-5 h-5" 
                          aria-hidden="true"
                          focusable="false"
                        />
                        <span 
                          id={`service-${service.value}-label`}
                          className="text-sm font-medium"
                        >
                          {service.label}
                        </span>
                        <span 
                          id={`service-${service.value}-desc`}
                          className="sr-only"
                        >
                          {isSelected ? 'Selected' : 'Not selected'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {getFieldStatus('interestedServices') === 'invalid' && fieldValidation.interestedServices?.error && (
                  <div 
                    id="services-error"
                    className="mt-3 flex items-start space-x-2 text-sm text-red-300"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle 
                      className="w-4 h-4 mt-0.5 flex-shrink-0" 
                      aria-hidden="true"
                      focusable="false"
                    />
                    <span>{fieldValidation.interestedServices.error}</span>
                  </div>
                )}
              </fieldset>

              {/* Others Service Description */}
              {formData.interestedServices.includes('others') && (
                <div role="group" aria-labelledby="other-service-label">
                  <label 
                    htmlFor="otherService" 
                    id="other-service-label"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2"
                  >
                    <span>Describe the specific service you need *</span>
                    {getFieldStatus('otherService') === 'valid' && (
                      <CheckCircle 
                        className="w-4 h-4 text-green-400" 
                        aria-hidden="true"
                        focusable="false"
                      />
                    )}
                  </label>
                  <textarea
                    id="otherService"
                    value={formData.otherService}
                    onChange={(e) => handleFieldChange('otherService', e.target.value)}
                    onBlur={() => handleFieldBlur('otherService')}
                    rows={3}
                    className={getFieldClasses('otherService', 'w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-300 transition-colors duration-200 resize-none')}
                    placeholder="Please describe the specific AI automation service you're looking for..."
                    aria-required="true"
                    aria-invalid={getFieldStatus('otherService') === 'invalid'}
                    aria-describedby={`other-service-help ${getFieldStatus('otherService') === 'invalid' ? 'other-service-error' : ''}`}
                  />
                  <div id="other-service-help" className="mt-1 text-xs text-gray-400">
                    Provide details about the custom AI automation service you need (10-500 characters)
                  </div>
                  {getFieldStatus('otherService') === 'invalid' && fieldValidation.otherService?.error && (
                    <div 
                      id="other-service-error"
                      className="mt-2 flex items-start space-x-2 text-sm text-red-300"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle 
                        className="w-4 h-4 mt-0.5 flex-shrink-0" 
                        aria-hidden="true"
                        focusable="false"
                      />
                      <span>{fieldValidation.otherService.error}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Problems/Automation Needs */}
              <div role="group" aria-labelledby="problems-label">
                <label 
                  htmlFor="problems" 
                  id="problems-label"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2"
                >
                  <span>What problems do you want to solve or processes do you want to automate? *</span>
                  {getFieldStatus('problems') === 'valid' && (
                    <CheckCircle 
                      className="w-4 h-4 text-green-400" 
                      aria-hidden="true"
                      focusable="false"
                    />
                  )}
                </label>
                <textarea
                  id="problems"
                  value={formData.problems}
                  onChange={(e) => handleFieldChange('problems', e.target.value)}
                  onBlur={() => handleFieldBlur('problems')}
                  rows={4}
                  className={getFieldClasses('problems', 'w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-300 transition-colors duration-200 resize-none')}
                  placeholder="Tell us about the challenges you're facing or the repetitive tasks you'd like to automate..."
                  aria-required="true"
                  aria-invalid={getFieldStatus('problems') === 'invalid'}
                  aria-describedby={`problems-help ${getFieldStatus('problems') === 'invalid' ? 'problems-error' : ''}`}
                />
                <div className="flex justify-between items-start mt-1">
                  <div id="problems-help" className="text-xs text-gray-400">
                    Describe the business challenges or processes you want to automate with AI
                  </div>
                  <div 
                    className={`text-xs ml-4 ${
                      formData.problems.length < 30 ? 'text-gray-400' : 'text-green-400'
                    }`}
                    aria-live="polite"
                    aria-label={`Character count: ${formData.problems.length} of 30 minimum characters`}
                  >
                    {formData.problems.length}/30 min
                  </div>
                </div>
                {getFieldStatus('problems') === 'invalid' && fieldValidation.problems?.error && (
                  <div 
                    id="problems-error"
                    className="mt-2 flex items-start space-x-2 text-sm text-red-300"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle 
                      className="w-4 h-4 mt-0.5 flex-shrink-0" 
                      aria-hidden="true"
                      focusable="false"
                    />
                    <span>{fieldValidation.problems.error}</span>
                  </div>
                )}
              </div>

              {/* Project Description Field - Optional */}
              <div role="group" aria-labelledby="description-label">
                <label 
                  htmlFor="description" 
                  id="description-label"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-200 mb-2"
                >
                  <span>Project Description (optional)</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors duration-200 resize-none"
                  placeholder="Describe your project, goals, and what you're looking to achieve with AI automation..."
                  aria-describedby="description-help"
                />
                <div id="description-help" className="mt-1 text-xs text-gray-400">
                  Optional: Additional details about your project and goals
                </div>
              </div>

              {/* Submit Button */}
              <div 
                className="flex justify-end space-x-4 pt-6"
                role="group"
                aria-label="Form actions"
              >
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-gray-200 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50 rounded-lg disabled:opacity-50"
                  aria-label="Reset form and clear all fields"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label={isSubmitting ? 'Submitting consultation request' : 'Submit consultation request'}
                  aria-describedby="submit-help"
                >
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  ></div>
                  <div className="relative flex items-center space-x-2">
                    {isSubmitting && (
                      <Loader2 
                        className="w-5 h-5 animate-spin" 
                        aria-hidden="true"
                        focusable="false"
                      />
                    )}
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
                  </div>
                </button>
              </div>
              <div id="submit-help" className="text-xs text-gray-400 text-right">
                We'll get back to you within 24 hours
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
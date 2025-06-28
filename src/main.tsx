import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize analytics as early as possible
import { analytics } from './utils/analytics';

// Initialize Google Analytics
analytics.init().then(() => {
  console.log('Analytics initialized successfully');
}).catch((error) => {
  console.error('Failed to initialize analytics:', error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
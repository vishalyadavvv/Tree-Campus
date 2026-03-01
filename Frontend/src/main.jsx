import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactDOM from 'react-dom';

// Zoom SDK Compatibility (React 18)
// Provide basic globals for the SDK's UMD bundle
window.React = React;
window.ReactDOM = ReactDOM;

import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// AOS for scroll animations
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
  duration: 700,
  easing: 'ease-in-out',
  once: false,
  mirror: true,
});

// NOTE: StrictMode is disabled to prevent the double-initialization 
// that can break the Zoom Meeting SDK in development.
ReactDOMClient.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);

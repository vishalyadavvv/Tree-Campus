// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add import
import App from './App.jsx';

// ✅ AOS for scroll animations
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
  duration: 700,
  easing: 'ease-in-out',
  once: false,
  mirror: true,
});

// Render App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Keep BrowserRouter here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);